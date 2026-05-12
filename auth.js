
import { supabase }
from './supabase.js';




// ======================================
// REGISTER USER
// ======================================

export async function registerUser(

  name,
  email,
  password,
  role = 'customer'

){

  const {
    data,
    error
  } = await supabase.auth.signUp({

    email: email,

    password: password

  });




  if(error){

    console.log(error);

    alert(error.message);

    return null;

  }




  // CREATE PROFILE
  if(data.user){

    const {
      error: profileError
    } = await supabase
      .from('profiles')
      .upsert({

        id: data.user.id,

        name: name,

        email: email,

        role: role

      });




    if(profileError){

      console.log(profileError);

    }

  }




  return data.user;

}








// ======================================
// LOGIN USER
// ======================================

export async function loginUser(

  email,
  password

){

  const {
    data,
    error
  } = await supabase.auth.signInWithPassword({

    email: email,

    password: password

  });




  if(error){

    console.log(error);

    alert(error.message);

    return null;

  }




  return data.user;

}








// ======================================
// GOOGLE LOGIN
// ======================================

export async function googleLogin(){

  const {
    error
  } = await supabase.auth.signInWithOAuth({

    provider:'google',

    options:{

      redirectTo:
      'http://127.0.0.1:5500/index.html'

    }

  });




  if(error){

    console.log(error);

    alert(error.message);

  }

}








// ======================================
// LOGOUT USER
// ======================================

export async function logoutUser(){

  const {
    error
  } = await supabase.auth.signOut();




  if(error){

    console.log(error);

    return;

  }




  window.location.href =
    'login.html';

}








// ======================================
// GET CURRENT USER
// ======================================

export async function getCurrentUser(){

  const {
    data:{ user }
  } = await supabase.auth.getUser();




  return user;

}








// ======================================
// GET USER PROFILE
// ======================================

export async function getUserProfile(){

  const user =
    await getCurrentUser();




  if(!user){

    return null;

  }




  const {
    data,
    error
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();




  if(error){

    console.log(error);

    return null;

  }




  return data;

}








// ======================================
// CHECK ROLE
// ======================================

export async function checkUserRole(){

  const profile =
    await getUserProfile();




  if(!profile){

    return null;

  }




  return profile.role;

}








// ======================================
// REQUIRE LOGIN
// ======================================

export async function requireLogin(){

  const user =
    await getCurrentUser();




  if(!user){

    window.location.href =
      'login.html';

  }

}








// ======================================
// REQUIRE SELLER
// ======================================

export async function requireSeller(){

  const role =
    await checkUserRole();




  if(role !== 'seller'){

    alert(
      'Seller access only'
    );




    window.location.href =
      'index.html';

  }

}








// ======================================
// REQUIRE ADMIN
// ======================================

export async function requireAdmin(){

  const role =
    await checkUserRole();




  if(role !== 'admin'){

    alert(
      'Admin access only'
    );




    window.location.href =
      'index.html';

  }

}
