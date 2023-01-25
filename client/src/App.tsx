import React, { useContext, useEffect, useState } from 'react';
import { Context } from '.';
import './App.css';
import LoginForm from './component/LoginForm'
import { observer } from 'mobx-react-lite';
import { IUser } from './models/IUser';
import UserService from './service/UserService';
import  Table  from "react-bootstrap/Table";
import deleteIcon from './assets/icons/delete.svg'
import blockIcon from './assets/icons/lock.svg'
import unblockIcon from './assets/icons/unlock.svg'
import reloadIcon from './assets/icons/reload.svg'

function App() {
  const {store} = useContext(Context)
  const [users,setUsers] = useState<IUser[]>([])
  useEffect(() => {
    if (localStorage.getItem('token')) {
        store.checkAuth()
    }
  }, [])

async function getUsers() {
    try{
      const response = await UserService.fetchUsers();
      setUsers(response.data)
    } catch(e) {

    }
  }
  if(store.isLoading) {
    return <div>Loading...</div>
  }

  const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{ 
    const { name, checked}= e.target;
  if(name==="allselect")
  {
  const checkedvalue = users.map( (user)=>{ return {...user, isChecked:checked}});
  console.log(checkedvalue);
  setUsers(checkedvalue);
  } else{
   const checkedvalue= users.map( (user)=>
   user.email ===name? {...user, isChecked:checked}:user);
   console.log(checkedvalue);
   setUsers(checkedvalue);
    } 
  }

  const handlealldelete = async()=>{
  for(let i=0; i<users.length; i++)
  {
    if(users[i].isChecked===true)
    {
      store.deleteUser(users[i].email);
    }
  }
}

  const handleallblock = async()=>{
  for(let i=0; i<users.length; i++)
  {
    if(users[i].isChecked===true)
    {
      store.blockUser(users[i].email);
    }
  }
}

  const handleallunblock = async()=>{
  for(let i=0; i<users.length; i++)
  {
    if(users[i].isChecked===true)
    {
      store.unblockUser(users[i].email);
    }
  }
}

  if(store.user.status === 'blocked') {
    store.setAuth(false)
  }

  if (!store.isAuth) {
    return (
      <LoginForm/>
    )
  }
  return (
    <>
      <h1>{store.isAuth ? `Welcome ${store.user.email}!` : 'You need to authorize' }</h1>
      <h1>{store.user.isActivated ? 'Email confirmed' : 'Email is not confirmed'}</h1>
      <div>
        <button onClick={() => store.logout()} className='logoutBut'>Log out</button>
      </div>
        <button onClick={handlealldelete} className='deleteBut'><img src={deleteIcon} alt='delete icon'/></button>
        <button onClick={handleallblock} className='blockBut'><img src={blockIcon} alt='block icon'/></button>
        <button onClick={handleallunblock} className='unblockBut'><img src={unblockIcon} alt='unblock icon'/></button>
        <button onClick={getUsers} className='reloadBut'><img src={reloadIcon} alt='reload icon'/></button>
        <Table striped={true} bordered={true} hover >
          <thead>
            <tr>
              <th>Select all: 
                <input 
                  type="checkbox" 
                  name="allselect" 
                  checked= { !users.some( (user)=>user?.isChecked!==true)} 
                  onChange={ handleChange}  
                />
              </th>
              <th>Email</th>
              <th>Last login</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => <tr key={user.email}><td><input type="checkbox" name={ user.email} checked={user?.isChecked|| false } onChange={ handleChange }  /></td><td>{user.email}</td><td>{user.loginTime.slice(0,25)}</td><td>{user.status}</td></tr>)}
          </tbody>
          
      </Table>
        
      
    </>
  );
}
export default observer(App);
