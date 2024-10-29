import { useState } from "react";

import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import './index.css'
const TodoList = (props)=>{
    const [isEdit,setisEdit] = useState(false);
    
    const {todos,checkboxStatus,DeleteTodo,saveTodo} = props
    const {id,todo,time,isDone} = todos

    const [editValue,setEditValue] = useState(todo)
    const onChangeCheckbox = (event)=>{
        
        checkboxStatus(id);
    }

    const onDeleteTodo = ()=>{
        DeleteTodo(id);
    }

    const onClickSave = ()=>{
        setisEdit(false)
        saveTodo(id,editValue)
    }

    const onEditInput = (event)=>{
        setEditValue(event.target.value)
    } 

    const paraStyle = isDone?'line-through':'none';
    const inputBg = isDone?'linear-gradient(to right,#0471de,#0471de':'linear-gradient(to right,#984f92,#4f7bb0)';
    const textCont = isEdit?'linear-gradient(to right,#ffffff,#ffffff,#ffffff':'linear-gradient(to right,#99d0b2,#85887f,#dc9dda)';
    const styleCont = isEdit?'3px solid #984f92':'none';
    const borderStlye = isDone?'1px solid #ffffff':'none';
    const onClickEdit = ()=>{
        setisEdit(prevState=>!prevState)
    }
    
    return (
        <li className="item">
            <p className="date-para">{time}</p>
            <div className="list-item">
                <div className="input-cont" style={{backgroundImage:inputBg,border:borderStlye}}>
                    <input onClick={onChangeCheckbox} defaultChecked={isDone} className="checkbox" type="checkbox" />
                </div>
                <div className='todo-item' style={{backgroundImage:textCont,border:styleCont}}>
                    {isEdit?(
                        <><input onChange={onEditInput} className="edit-input" value={editValue} type="text" />
                        <button onClick={onClickSave} className="edit-button" type="button"><FaSave size={20} /></button>
                    </>):(<>
                        <p className='todo-text' style={{textDecoration:paraStyle}}>{todo}</p>
                        {!isDone?<button onClick={onClickEdit} className="edit-button" type="button"><BiSolidEdit size={20}/></button>:''}
                        </>)}
                    
                    
                </div>
                <button onClick={onDeleteTodo} className="delete-btn" type='button'><MdDelete size={22} color={'#ffffff'} /></button>
            </div>
            
        </li>
    )

}

export default TodoList