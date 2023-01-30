import Editor from "@monaco-editor/react";
import React, {  useState, useEffect } from "react";
import axios from 'axios'
import FileOpen from "./fileOpen";
// import fs  from "fs";

import "./index.css";
export function Myeditor() {
    // const fileName = 'log.csv';
    const header = [
        "date",
        "time",
        "startLine",
        "startColumn",
        "text",
        "event"
      ];
    const [fileUrl, setFileUrl] = useState([]);
    const [displayList, setDisplayList] = useState([]);
    const [fileContent, setFileContent] = useState('');
    const [changeCounts, setChangeCounts] = useState(0);
    const [decIns, setDecIns] = useState([]);
    const [decDel, setDecDel] = useState([]);
    const [log,setLog] =useState([]);
    let autosave=1;
    const [startEventFlag, setStartEventFlag] = useState(0);
    const [giveListLog, setGiveListLog] = useState([
        {
        'string': '',
        'date': '',
        'offSetNum': 0,
        }
    ]);
    const [tempgivestring, setTempgivestring] = useState([
        {
        'string': '',
        'date': '',
        'offSetNum': 0,
        }
    ]);
    // const csv = require("fast-csv");
    // const { format } = require('@fast-csv/format');
    // const logfile = 'log.csv';
    // const fs = require("fs");
    // const csvFile = fs.createWriteStream(logfile);
    const [vars, setVars] = useState({});
    const { monacoEditor, monaco } = vars;
    let delString, delSLine,     delSColmn,    delELine,     delEColmn; 
    useEffect(() => {
        if (fileContent) {
            setStartEventFlag(1);    
        }
    });    
    useEffect(() => {
        if (!monacoEditor || !monaco) {
          return;
        }
        const qwe = monacoEditor.deltaDecorations(
          [], decIns
        );
        const qwea = monacoEditor.deltaDecorations(
            [], decDel
          );
        return () => {
            monacoEditor.deltaDecorations(qwe, []);
            monacoEditor.deltaDecorations(qwea, []);
        }
    }, [changeCounts]);   
    
    const editorDidMount =(monacoEditor, monaco) => {        
        setVars({ monacoEditor, monaco });
        monacoEditor.onMouseDown(function () { });        
        monacoEditor.onMouseUp(function () {
            let insertrange = {
                range: monacoEditor.getSelection(),
                options: { inlineClassName: "base.case.lol" }
            }
            if(decDel.length<1){
            }
            else{
                let asa = decDel.map(item => Object.assign(item));asa.push(insertrange);setDecDel(asa);  
            }  
            delSLine=monacoEditor.getSelection().startLineNumber;   
            delSColmn=  monacoEditor.getSelection().startColumn; 
            delELine=monacoEditor.getSelection().endLineNumber;   
            delEColmn=  monacoEditor.getSelection().endColumn; 
            delString=monacoEditor.getModel().getValueInRange(monacoEditor.getSelection());
        });
        monacoEditor.onKeyDown(function (event) {
            const date = new Date();
            let cur=date.getMinutes();
            if(((cur%2===0)&&autosave)){       
                autosave=0;       
                writeServer(monacoEditor,monaco);
                // readlog();
                // console.log("ppppppppp",log);     
            }
            if(cur%2===1){autosave=1;}            
            if(event.code==="Delete"){
                const sl=delSLine,sc=delSColmn,el=delELine,ec=delEColmn;
                monacoEditor.executeEdits("", [ { range: new monaco.Range(sl,sc,sl,sc), text: delString ,forceMoveMarkers: true} ]);
                let insertrange = {
                    range: new monaco.Range(sl, sc, el, ec),
                    options: { inlineClassName: "base.case.lol" }
                }                
                let tempAsd = decDel;                
                tempAsd.push(insertrange);
                setDecDel(tempAsd);
                let p=changeCounts;p++;setChangeCounts(p);
            }
            else {       
                if (decIns.length===0) {//Startting
                    let insertrange = {
                        range: new monaco.Range(delSLine, delSColmn, delELine, delEColmn),
                        options: { inlineClassName: "base.case.rofl" }
                    }
                    let tempAsd = decIns;
                    tempAsd.push(insertrange);
                    setDecIns(tempAsd);
                }
                else{//Not Startting
                    if((decIns[decIns.length-1].range.startLineNumber===delSLine)&&(decIns[decIns.length-1].range.startColumn===delSColmn)){//Contiuous     
                        decIns.map(item=>{
                            if((item.range.startLineNumber===delSLine)&&(delSColmn<=item.range.startColumn) ){
                                let a=item.range.startLineNumber,b=item.range.startColumn+1,c=item.range.endLineNumber,d=item.range.endColumn+1;
                                item.range=new monaco.Range(a,b,c,d); 
                            }
                        })   
                        decDel.map(item=>{
                            if((item.range.startLineNumber===delSLine)&&(delSColmn<=item.range.startColumn) ){
                                let a=item.range.startLineNumber,b=item.range.startColumn+1,c=item.range.endLineNumber,d=item.range.endColumn+1;
                                item.range=new monaco.Range(a,b,c,d); 
                            }
                        })            
                        let tempAsd = decIns;
                        tempAsd[tempAsd.length-1].range=new monaco.Range(delSLine, delSColmn, delELine, monacoEditor.getSelection().startColumn);
                        setDecIns(tempAsd);
                        // console.log("Continuos");
                    }
                    else{//Not contiuous
                        decIns.map(item=>{
                            if((item.range.startLineNumber===delSLine)&&(delSColmn<=item.range.startColumn) ){
                                let a=item.range.startLineNumber,b=item.range.startColumn+1,c=item.range.endLineNumber,d=item.range.endColumn+1;
                                item.range=new monaco.Range(a,b,c,d); 
                            }
                        })
                        decDel.map(item=>{
                            if((item.range.startLineNumber===delSLine)&&(delSColmn<=item.range.startColumn) ){
                                let a=item.range.startLineNumber,b=item.range.startColumn+1,c=item.range.endLineNumber,d=item.range.endColumn+1;
                                item.range=new monaco.Range(a,b,c,d); 
                            }
                        })
                        
                        if((decIns[decIns.length-1].range.startLineNumber<=delSLine)||(decIns[decIns.length-1].range.startColumn<=delSColmn)){
                            let insertrange = {
                                range: new monaco.Range(delSLine, delSColmn, delELine, delEColmn),
                                options: { inlineClassName: "base.case.rofl" }
                            }
                            let tempAsd = decIns;
                            tempAsd.push(insertrange);
                            setDecIns(tempAsd);
                            // console.log("Qere");
                            // setDecIns(as);
                        }
                        else{//before  in the furture  keycode=enter action process add.
                            let insertrange = {
                                range: new monaco.Range(delSLine, delSColmn, delELine, delEColmn),
                                options: { inlineClassName: "base.case.rofl" }
                            }
                            let tempAsd = decIns;
                            tempAsd.push(insertrange);
                            setDecIns(tempAsd);
                            // console.log("Up editting");
                        }                   
                        // console.log("Not continuous");
                    }
                    // console.log("Now started");
                }
                // setPrevPos(delSLine*100+delSColmn);
                let a=changeCounts;a++;
                setChangeCounts(a);    
            }
            if(event.ctrlKey&&event.code==="KeyU"){//Ctrl+X action                
                writeServer(monacoEditor,monaco);
                // console.log("Save");
            }
            if(event.ctrlKey&&event.code==="KeyY"){//Ctrl+X action                
                // ctrlclicked=true;
                readlog();
                // console.log("Cut",result);
            }
            }
        );
        monacoEditor.focus();
    }
    
    const handleClickInfo = (selectedIndex) => {
        const newDisplayList = displayList.map((item, index) => {
            if(index === selectedIndex) item.show = !(item.show);
            return item;
        });
        setDisplayList(newDisplayList);
    }
    
    const handleEditorChange = (count, event) => {  
        let p=changeCounts;p++;setChangeCounts(p);
          
    }
    async function readlog() {
        try{
            let res = await axios.get("http://localhost:4000/log/read-csv");
            if (res.data) {
                const indexOf = function(time){
                    return this.findIndex(el => el.time === time)
                };   
                Array.prototype.indexOf = indexOf;
                const resa = [];                    
                const groupArray = arr => {
                    for(let i = 0; i < arr.length; i++){
                        const ind = resa.indexOf(arr[i].time);
                        if(ind !== -1){
                            if(arr[i].event==="insert"){
                                resa[ind].ins+=`, ${arr[i].text}`;
                            }
                            else{
                                resa[ind].del+=`, ${arr[i].text}`;
                            }
                        }else{
                            let item;
                            if(arr[i].event==='insert')item={date:arr[i].date,time:arr[i].time,ins:arr[i].text,del:''};
                            else item={date:arr[i].date,time:arr[i].time,ins:'',del:arr[i].text};                            
                            resa.push(item);
                        }
                    };
                }
                groupArray(res.data);  
                console.log("my aim",resa)           ;   
                setLog(resa);
            }
        }
        catch(error){ 
            console.log('read error');
        }
    }
    
    function writeServer(monacoEditor,monaco){
        const date = new Date();
        decDel.map(item=>{
            let arr=[
                date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate(),
                date.getHours() + ':' + date.getMinutes()  + ":" + date.getSeconds(),
                item.range.startLineNumber,
                item.range.startColumn,
                monacoEditor.getModel().getValueInRange(new monaco.Range(item.range.startLineNumber, item.range.startColumn, item.range.endLineNumber, item.range.endColumn)),
                "Delete"
            ];    
            console.log(arr)
            writelog(arr);
        });
        decIns.map(item=>{
            let arr=[
                date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate(),
                date.getHours() + ':' + date.getMinutes()  + ":" + date.getSeconds(),
                item.range.startLineNumber,
                item.range.startColumn,
                monacoEditor.getModel().getValueInRange(new monaco.Range(item.range.startLineNumber, item.range.startColumn, item.range.endLineNumber, item.range.endColumn)),
                "insert"
            ];   
            console.log(arr) 
            writelog(arr);
        });    
    }
    async function writelog(arr) {        
        try{
            let res = await axios.post("http://localhost:4000/log/write-csv",arr);
            if (res.data.success) {
                console.log('write success');
            }
        }
        catch(error){ 
            console.log('write error');
        }
    }

    return (
        <div className="w-full flex justify-center flex-col mt-5  rounded border-b-1 border-[#451356] ">
            <div className="w-full text-4xl font-bold text-[#451356] h-12 text-center">Monaco Editor</div>
            <div className="w-full">
                <FileOpen setTempgivestring={setTempgivestring} setStartEventFlag={setStartEventFlag} setFileContent={setFileContent} setFileUrl={setFileUrl}/>
            </div>
            <div className="w-full flex flex-row border ">
                <div className="w-2/3 border-spacing-1 border-[#000000] ">                    
                <EditorWrapper
                    path={fileUrl.name} defaultLanguage={fileUrl.type} value={fileContent} handleEditorChange={handleEditorChange} editorDidMount={editorDidMount}/>  
                </div>
                <div className="w-1/3  bg-[#D9E8F5]  " >
                    <div className='flex-col p-5'>
                        <p className='text-2xl font-bold'>Tracked Changes</p>                        
                        <div className='border-spacing-1 '>                            
                            <div className='h-auto'>
                                {log && log.map((item, index) =>(
                                    <div key = {index} className='border rounded-xl shadow-slate-700 border-b-indigo-400'>
                                        <p className='text-xl font-medium'>Tracked Changes:{index.date}</p>
                                        <p className='text-mm pl-5 hover:text-lime-800 cursor-pointer' onClick={() => handleClickInfo(index)}>{item.time}</p>
                                        <p className="text-sm  pl-5">Insert:    {item.ins}</p>
                                        <p className="text-sm pl-5">Delete:     {item.del}</p>
                                    </div>
                                ))}   
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
function EditorWrapper({ theme, path,defaultLanguage,value, language, editorDidMount, handleEditorChange }) {
    return (
        <Editor
            height="80vh"
            theme={theme}
            path={path}
            value={value}
            onMount={editorDidMount}
            onChange={handleEditorChange}
            /> 
    );
}
