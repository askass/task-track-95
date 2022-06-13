import { Task } from "../pages";
import styled from "styled-components";
import React from "react";


const TaskLi =  styled.li`
    display: 'flex';
    background: #FFFFFF;
    margin-top: 1px;
`;

const TaskUL =  styled.ul`
    padding: 0;
    margin:1px; 
`;

const TaskInput =  styled.input`
    border: none;
    background-color: white;
    &:focus {
        border: none;
        outline: none;
    }
`;

const Btn =  styled.button`
    background-color: white;
    color: black;
    border: none;
    padding: 5px 5px;
    min-width: 25x;
    font-size: 16px;
    border-radius: 0px;
    cursor: pointer;
    transition: opacity 200ms ease-out;
    width: 36px;
    
    &:hover {
    background: #F1F1F1;
    }
    &:active {
        background: #FFFFFF;
    }
    &:disabled {
    opacity: 0.4;
    cursor: disabled;
    }
`;


export function HistoryItemsList({tasks, resume, remove, edit}){

    return (
        <>
            <TaskUL>
                {tasks.map((task, index, array)=>{
                    let val:Task = array[array.length - 1 - index];
                    if(!val.running){
                        return (
                            <TaskLi key={val.id}>
                                <div  style={{ display: 'flex' }}>
                                    <Btn 
                                        onClick={() => {
                                        resume(array.length - 1 - index);
                                        }}>▶</Btn>

                                    <Btn onClick={() => {
                                        remove(val.id);
                                        }}>✖</Btn>

                                    <TaskInput type="text" defaultValue={val.name} 
                                        onChange={(e) =>edit(e.target.value, array.length - 1 - index)}/> 

                                    <p style={{ textAlign: 'right' }}>{new Date(val.workedTime).toISOString().slice(11,19)}</p>
                                </div>  
                            </TaskLi>
                        );
                    }
                }) }
            </TaskUL>
        </>
    );    
}