import type { NextPage } from 'next'
import Head from 'next/head'
import { Button , ThemeProvider, TitleBar, Frame, Fieldset, Input } from '@react95/core'
import '@react95/icons/icons.css';
import styled from "styled-components";
import { useState, useRef,useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import {HistoryItemsList} from "../Components/HistoryItemsList";

export const Timer = styled.p`
font-size: 16px;
padding-left: 1em;
padding-top:5px;
vertical-align: middle;
margin-block-start: 0em;
margin-block-end: 0em;
`;

export const History = styled.p`
font-size: 12px;
vertical-align: middle;
margin-block-start: 0em;
margin-block-end: 0em;
`;

export const Total = styled.p`
font-size: 12px;
padding-left: 1em;
padding-top:7px;
vertical-align: middle;
margin-block-start: 0em;
margin-block-end: 0em;
`;

export class Task{
  startTime: number;
  endTime:number = 0;
  name: string;
  id: string;
  running: boolean;
  workedTime: number = 0;

  constructor(name:string, running:boolean){
    this.name = name;
    this.running = running;
    this.startTime = new Date().getTime();
    this.id = uuidv4()
  }

  setEndTime(){
    this.endTime = new Date().getTime();
    this.running = false;
    this.setWorkedTime();
  }
  startAgain(){
    this.startTime = new Date().getTime();
    this.running = true;
  }
  setWorkedTime(){
    this.workedTime += this.endTime - this.startTime;
  }

}


let currentTaskId:string ="";
let currentTaskStartTime:number = -1;

const Home: NextPage = () => {

 

  const [tasks, setTasks] = useState<Task[]>([]);
  const [track, setTrack] = useState(false);
  const [time, setTime] = useState("00:00:00");
  const [total, setTotal] = useState("00:00:00");
  const [mname, setMname] = useState("");


  function saveBackupToLocalStorage(){
    localStorage.setItem("tasks", JSON.stringify(tasks)); 
  }

  function loadBackupFromLocalStorage(){
    const tempItems = localStorage.getItem("tasks");
    const mTasks:Task[] = (tempItems ? JSON.parse(tempItems) : []) as Task[];
    mTasks.forEach((task)=>{
        Object.setPrototypeOf(task, Task.prototype)
        if(task.running){
          currentTaskId = task.id
          setMname(task.name);
          currentTaskStartTime = task.startTime - task.workedTime;
          setTime(formatTime(Date.now() - task.startTime + task.workedTime))
          setTrack(true);
          return;
        }
    })
    console.log(mTasks);
    setTasks(mTasks);
  }

  useEffect(()=>{
    loadBackupFromLocalStorage();
  },[]);
 

  
  function formatTime(numMls:number):string {
    return new Date(numMls).toISOString().slice(11,19)
  }

  useEffect(() => {
    if(track && currentTaskStartTime){
      const interval = setInterval(() => {
        setTime(formatTime(Date.now() - currentTaskStartTime));
      }, 1000);
      return () => clearInterval(interval);
    }
    
  }, [track]);

  
  useEffect(() => {
    updateTotal();
    saveBackupToLocalStorage();
    console.log(tasks);
  }, [tasks]);
  

  function handleLFGClick(){
   
    if(currentTaskId==="" && currentTaskStartTime === -1){
      let currentTask = new Task( mname, true)
      let arr = [
        ...tasks,
        currentTask
      ]
      setTasks(arr);
      currentTaskId = currentTask.id
      currentTaskStartTime = currentTask.startTime
      setTrack(true);
    }else{
      let n = getCurrentTaskId(currentTaskId);
      if(n !== -1)
      restartTaskTrack(tasks[n]);   
    } 
    
  }

  function restartTaskTrack(task:Task){
    if(task){
      if(currentTaskId !=="" && currentTaskStartTime !== -1){
        handleStopClick();
        setTasks([...tasks])
      }
      
      currentTaskId = task.id
      setMname(task.name);
      currentTaskStartTime = Date.now() - task.workedTime;
      task.startAgain();
      setTime(formatTime(task.workedTime))
      setTrack(true);
      saveBackupToLocalStorage();
    }
  }

  function getCurrentTaskId(id:string):number{
    let ind:number = -1;
    tasks.forEach((task, index)=>{
      if(task.id == id){
        ind = index;
        return;
      }
    })
    return ind;
  }

  function handleStopClick(){
    let n = getCurrentTaskId(currentTaskId);
    if(n !== -1){
      tasks[n].setEndTime();
      tasks[n].name = mname;
    }
    currentTaskId = "";
    currentTaskStartTime= -1;

    setMname("");
    setTime("00:00:00");
    updateTotal()
    setTrack(false);
    saveBackupToLocalStorage();
  }

  function updateTotal(){
    let ttl:number = 0;
    tasks.forEach((task:Task)=>{
      if(!task.running){
        ttl+= task.workedTime;
      }
      
    })

    setTotal(formatTime(ttl));
  }

  function handleHistoryResumeBtn(index:number){
        restartTaskTrack(tasks[index]);
  }

  function handleRemoveBtn(id:string){
    setTasks(
      tasks.filter((task:Task) => {
        return task.id !== id;
      })
    );
    
  }

  function handleNameChange(name:string, index:number){
    tasks[index].name = name;
    saveBackupToLocalStorage();
  }

  function handleClear(){
    setTasks(
      tasks.filter((task:Task) => {
        return task.running;
      })
    );
  }




  return (
    <div >
      <Head>
        <title>TASK TRACK 95</title>
        <meta name="description" content="TASK TRACK 95" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        <ThemeProvider>
          <h1>TASK TRACK 95</h1>
          <TitleBar active={false} title={"BYASKAS.EXE"} w={200} />
          <br/>
          <Frame w={350} style={{ padding: '1em'}}>
            <Fieldset legend="Current Task" style={{ marginTop: '0.5em'}}  >
              <Input value={mname} onChange={(e:any)=>setMname(e.target.value)} style={{ marginTop: '0.5em',width:'95%' }}
                id="#wauwf"
                type="text"
                placeholder="What are you working for?" />
              <br/>
              <br/>
              <div style={{ display: 'flex' }}>
                 {!track  && <Button style={{ width: '70px'}} onClick={handleLFGClick}>LFG</Button>}
                 {track && <Button style={{ width: '70px'}} onClick={handleStopClick}>Stop</Button>}
                  <Timer>{time}</Timer>
              </div>
              <br/>
            </Fieldset>
            <br/>
            <br/>
            <History>History:</History>
            <Frame w={200} h={300} boxShadow="in" style={{width:'100%', overflowY:'scroll'  }}>
              <HistoryItemsList tasks={tasks} resume={handleHistoryResumeBtn} remove={handleRemoveBtn} edit={handleNameChange}/>
            </Frame>
            <br/>
            <div style={{ display: 'flex' }}>
                  <Button onClick={handleClear}>Clear</Button>
                  <Total>Total: {total}</Total>
            </div>            
          </Frame>
        </ThemeProvider>
      </main>
    </div>
  )
}



export default Home



