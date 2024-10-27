import { useState,useEffect } from 'react'
import TodoList from '../todoList'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Rings } from 'react-loader-spinner'
import { TbRefresh } from "react-icons/tb";
import Swal from 'sweetalert2'

import './index.css'

const apiConstants = {
    initial:'INITIAL',
    success:'SUCCESS',
    failure:'FAILURE',
    empty:'EMPTY',
    inProgress:'IN-PROGRESS'
}

const TodoHome = ()=>{

    const [todoText,setTodo] = useState('');
    const [todoList,setTodoList] = useState([]);
    const [apiStatus,setApiStatus] = useState(apiConstants.initial);
    let timeOut = null;
    const fetchData = async ()=>{
        setApiStatus(apiConstants.inProgress)
        const url = 'http://localhost:3007/todos';
        const response = await fetch(url);
        if(response.ok){
            const data = await response.json()
            setTodoList(data.reverse())
            timeOut = setTimeout(() => {
                setApiStatus(apiConstants.success)
            }, 1000);
            
        }else{
            setApiStatus(apiConstants.failure)
        }
        return ()=> clearTimeout(timeOut)
    }

    useEffect(()=>{
        fetchData();
        
    },[]);

    

    const onChangeInput = (event)=>{
        setTodo(event.target.value);
        
    }

    const onSaveTodo = async (id,val)=>{
        const date = new Date();
        const dateTime = date.toLocaleString()
        const updatedData = todoList.map(eachTodo=>{
            if(id === eachTodo.id){
                return {...eachTodo,todo:val,time:`mdf ${dateTime}`}
            }
            return eachTodo;
        });

        const response = await axios.put(`http://localhost:3007/updateTodoText/${id}`,{todo:val,time:`mdf ${dateTime}`}).then(response=>{
            return response
        }).catch(err=>{
            return err
        })

        setTodoList(updatedData);
    }

    const onCheckedCheckbox = async (id)=>{
        let checkStatus = null;
        const date = new Date();
        const dateTime = date.toLocaleString()

        const changeObj = todoList.find(eachTodo=>(eachTodo.id === id));
        const updatedData = todoList.map(eachTodo=>{
            if(id === eachTodo.id){
                return {...eachTodo,isDone:!eachTodo.isDone}
            }
            return eachTodo
        })

       const response = await axios.put(`http://localhost:3007/updateTodo/${id}`,{isDone:!changeObj.isDone,time:`done ${dateTime}`}).then(response=>{
            return response
        }).catch(err=>{
            return err
        })
        setTodoList(updatedData)
        
        
        
    }

    const listView = ()=>{
       
    
        switch(apiStatus){
            case apiConstants.success:
                return successView()
            case apiConstants.failure:
                return null
            case apiConstants.inProgress:
                return loadingView()
            case apiConstants.empty:
                return null
            default:
                return null
        }
    }


    // const emptyView = ()=>{
    //     return (
    //         <div className='empty-container'>
    //             <img src='https://res.cloudinary.com/dbb5puzve/image/upload/v1729866445/empty_todo_higfeu.png' />
    //             <h1 className='empty-text'>Create your Todo</h1>
    //         </div>
    //     )
    // }

    const successView = ()=>{
        return (
            <div className='todo-list'>
                
                <ul className='list-container'>
                {todoList.map(eachTodo=>(
                    <TodoList 
                    key={eachTodo.id} 
                    checkboxStatus={onCheckedCheckbox} 
                    todos={eachTodo}
                    DeleteTodo={onDeleteTodo}
                    saveTodo={onSaveTodo}
                    />))}
                    
                </ul>
            </div>
        )
    }

    const loadingView = ()=>{
        return (
            <div className='loading-container'>
                <Rings
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="rings-loading"
            wrapperStyle={{}}
            wrapperClass=""
            />
            </div>
            
        )
}
    

    const onDeleteTodo = async (id)=>{
        const filterData = todoList.filter(eachTodo => (id !== eachTodo.id))
        setTodoList(filterData);
        await axios.delete(`http://localhost:3007/deleteTodo/${id}`).then(response=>{
            console.log(response);
        }).catch(err=>{
            console.log(err);
        })
        
    }

    const onClickRefreshBtn = ()=>{
        fetchData()
        // return (Swal.fire({
        //     title: 'Success',
        //     icon: 'success',
        //     confirmButtonText: 'Done'
        //   }))
    }

    const onClickAdd = async ()=>{
        const date = new Date();
        const time = date.toLocaleString()
        const newTodo = {
            id: uuidv4(),
            todo:todoText,
            time:time,
            isDone:false
        }
        await axios.post(`http://localhost:3007/newTodo`,newTodo).then(response=>{
            console.log(response)
        }).catch(err=>{
            console.log(err)
        })
        setTodoList([newTodo,...todoList])
        setTodo('')
        
    }


    return (
        <div>
            <h1 className='todo-heading'>TODO LIST</h1>
            <div className='create-add-container'>
                <input onChange={onChangeInput} value={todoText} placeholder='Enter what you need to done'/>
                <button onClick={onClickAdd} type='button' className='add-button'>Add</button>
            </div>
            <div className='save-head-container'>
                <h1 className='mytasks-heading'>My Tasks</h1>
                <button type='button' onClick={onClickRefreshBtn} className='refresh-button'><TbRefresh size={18}/></button>
            </div>
            
            {listView()}
            
        </div>
    )
}

export default TodoHome 