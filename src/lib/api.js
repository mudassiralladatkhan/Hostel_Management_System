import { supabase } from './supabase';

/**
 * Fetches all the necessary statistics for the main dashboard.
 * @returns {Promise<object>} An object containing various stats.
 */
export const getDashboardStats = async () => {
  const [
    { count: studentsCount, error: studentsError },
    { count: roomsCount, error: roomsError },
    { count: occupiedRoomsCount, error: occupiedError },
    { data: feeData, error: feeError }
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('rooms').select('*', { count: 'exact', head: true }),
    supabase.from('allocations').select('*', { count: 'exact', head: true }).is('end_date', null),
    supabase.from('fees').select('total_amount, paid_amount')
  ]);

  if (studentsError) throw studentsError;
  if (roomsError) throw roomsError;
  if (occupiedError) throw occupiedError;
  if (feeError) throw feeError;

  return {
    studentsCount: studentsCount || 0,
    roomsCount: roomsCount || 0,
    occupiedRoomsCount: occupiedRoomsCount || 0,
    availableRoomsCount: (roomsCount || 0) - (occupiedRoomsCount || 0),
    feeStatus: {
      paid: feeData.filter(f => f.total_amount - f.paid_amount <= 0).length,
      pending: feeData.filter(f => f.total_amount - f.paid_amount > 0).length,
    }
  };
};

/**
 * Fetches room data grouped by block for the occupancy chart.
 * @returns {Promise<object>} Data formatted for the chart.
 */
export const getRoomOccupancyByBlock = async () => {
    const { data, error } = await supabase
        .from('rooms')
        .select('block, id');

    if (error) throw error;

    const { data: allocations, error: allocationError } = await supabase
        .from('allocations')
        .select('room_id')
        .is('end_date', null);
    
    if (allocationError) throw allocationError;

    const occupiedRoomIds = new Set(allocations.map(a => a.room_id));

    const occupancy = data.reduce((acc, room) => {
        if (!acc[room.block]) {
            acc[room.block] = 0;
        }
        if (occupiedRoomIds.has(room.id)) {
            acc[room.block]++;
        }
        return acc;
    }, {});

    return {
        labels: Object.keys(occupancy),
        values: Object.values(occupancy),
    };
};


/**
 * Fetches the most recent visitor logs.
 * @returns {Promise<Array<object>>} A list of recent visitors.
 */
export const getRecentVisitors = async () => {
  const { data, error } = await supabase
    .from('visitors')
    .select(`
      id,
      name,
      in_time,
      out_time,
      student:students (
        profile:profiles ( full_name )
      )
    `)
    .order('in_time', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
};

/**
 * Fetches all student records.
 * @returns {Promise<Array<object>>} A list of all students.
 */
export const getStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select(`
      id,
      course,
      year,
      contact_number,
      student_id,
      profile:profiles (
        id,
        full_name,
        email,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Creates a new student user and their associated records.
 * @param {object} studentData - The data for the new student.
 * @returns {Promise<object>} The newly created user data.
 */
export const addStudent = async (studentData) => {
  const { email, password, fullName, course, year, contactNumber } = studentData;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'Student',
        course: course,
        year: year,
        contact_number: contactNumber
      },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });

  if (error) {
    // Handle specific error for already registered user
    if (error.message.includes('User already registered')) {
      throw new Error('A user with this email already exists.');
    }
    throw error;
  }
  
  // Check if user was created but is already registered (identities array is empty)
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    throw new Error('A user with this email already exists.');
  }

  return data;
};
