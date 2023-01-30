import Editor from "@monaco-editor/react";
import React, {  useState, useEffect } from "react";
import FileOpen from "./fileOpen";


import "./index.css";
export function Myeditor() {
    const fileName = 'log.csv';
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
    const obj = [...decIns, ...decDel];
    const csv = require("fast-csv");
    const { format } = require('@fast-csv/format');
    const logfile = 'log.csv';
    const fs = require("fs");
    const csvFile = fs.createWriteStream(logfile);
    const [vars, setVars] = useState({});
    const { monacoEditor, monaco } = vars;
    let delString, delSLine,     delSColmn,    delELine,     delEColmn; 
    useEffect(() => {
        if (fileContent) {
            setStartEventFlag(1);    
        }
    }, []);    
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
        // console.log("dec array==========",decIns.length,"========",decDel.length,"==========",decIns);
        return () => {
            monacoEditor.deltaDecorations(qwe, []);
            monacoEditor.deltaDecorations(qwea, []);
        }
    }, [changeCounts]);   
    
    const editorDidMount =(monacoEditor, monaco) => {        
        setVars({ monacoEditor, monaco });
        monacoEditor.onMouseDown(function () { });
        // if(enterpressed){
        //     let a2=monacoEditor.getSelection().startLineNumber;
        //     let b2=monacoEditor.getSelection().startColumn;
        //     let c2=monacoEditor.getSelection().endLineNumber;
        //     let d2=monacoEditor.getSelection().endColumn;
        //     console.log(a1,' ',b1,' ',c1,' ',d1,' ',a2,' ',b2,' ',c2,' ',d2);
        //     decIns.map(item=>{
        //         if(item.range.startLineNumber>c1){
        //             let a=item.range.startLineNumber,b=item.range.startColumn,c=item.range.endLineNumber,d=item.range.endColumn;
        //             item.range=new monaco.Range(a+1,b,c+1,d); 
        //         }
        //         else if(item.range.startLineNumber===c1){
        //             let a=item.range.startLineNumber,b=item.range.startColumn,c=item.range.endLineNumber,d=item.range.endColumn;
        //             item.range=new monaco.Range(a,b,c,d); 
        //         }
        //     }) 
        // }
        
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
        monacoEditor.onKeyDown(function (event) {//console.log("bbbbbbbbbbbbbb"); 
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
                    if((decIns[decIns.length-1].range.startLineNumber==delSLine)&&(decIns[decIns.length-1].range.startColumn==delSColmn)){//Contiuous     
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
                            let as = decIns.map(item => Object.assign(item));
                            let insertrange = {
                                range: new monaco.Range(delSLine, delSColmn, delELine, delEColmn),
                                options: { inlineClassName: "base.case.rofl" }
                            }
                            // as.push(insertrange);
                            console.log("up part",delSLine, delSColmn, delELine, delEColmn);
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
                // ctrlclicked=true;
                saveFile();
                // console.log("Save");
            }
            // if(event.ctrlKey&&event.code==="KeyX"){//Ctrl+X action                
            //     // ctrlclicked=true;
            //     console.log("Cut");
            // }
            // if(event.ctrlKey&&event.code==="KeyV"){//Ctrl+X action                
            //     // ctrlclicked=true;
            //     console.log("Past");
            // }
            // if(event.ctrlKey&&event.code==="KeyF"){//Ctrl+X action 
            //     // console.log("asdfasdfasfdf") ;              
            //     // monacoEditor.getModel().findMatches('for');
            //     // const position = monacoEditor.getModel().getPositionAt(1);//index
            //     // const { lineNumber, column } = position;
            //     // console.log(lineNumber);
            // }
            // if(event.ctrlKey&&event.code==="KeyR"){//Ctrl+X action                
            //     // ctrlclicked=true;
            //     console.log("Replace");
            // }
            // if(event.code==="Enter"){//Ctrl+X action                
                // ctrlclicked=true;
                // console.log("aaaaaaaaaa====",monacoEditor.getSelection());
                // if(!enterpressed){
                //     a1=monacoEditor.getSelection().startLineNumber;
                //     b1=monacoEditor.getSelection().startColumn;
                //     c1=monacoEditor.getSelection().endLineNumber;
                //     d1=monacoEditor.getSelection().endColumn;
                //     enterpressed=true;
                // }          
                // console.log("EnterPressed");
                // console.log(monacoEditor.trackSelection( new monaco.Selection(5, 0, 50, 8)));
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
    // const processCSV = (str, delim=',') => {
    //     const headers = str.slice(0,str.indexOf('\n')).split(delim);
    //     const rows = str.slice(str.indexOf('\n')+1).split('\n');

    //     const newArray = rows.map( row => {
    //         const values = row.split(delim);
    //         const eachObject = headers.reduce((obj, header, i) => {
    //             obj[header] = values[i];
    //             return obj;
    //         }, {})
    //         return eachObject;
    //     })

    //     setCsvArray(newArray)
    // }
    const saveFile  = async (blob, fileUrl) => {
        // const a = document.createElement('a');
        // a.download = fileUrl.name;
        // a.href = URL.createObjectURL(blob);
        // a.addEventListener('click', (e) => {
        //   setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
        // });
        // a.click();
        const stream = format({ headers:true });
        stream.pipe(csvFile);
        stream.write(header);const date = new Date();
        decDel.map(item=>{
            let arr=[
                date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate(),
                date.getHours() + ':' + date.getMinutes()  + ":" + date.getSeconds(),
                item.range.startLineNumber,
                item.range.startColumn,
                monacoEditor.getModel().getValueInRange(new monaco.Range(item.range.startLineNumber, item.range.startColumn, item.range.endLineNumber, item.range.endColumn)),
                "Delete"
            ];    
            stream.write(arr);
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
            stream.write(arr);
        });    
        stream.end();
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
                                {giveListLog && giveListLog.map((item, index) =>(
                                    <div key = {index} className='border rounded-xl shadow-slate-700 border-b-indigo-400'>
                                        <p className='text-xl font-medium'>Tracked Changes:{changeCounts}</p>
                                        <p className='text-mm pl-5 hover:text-lime-800 cursor-pointer' onClick={() => handleClickInfo(index)}>{item.show ? item.string : item.string.slice(0, 5)+'...'}</p>
                                        <p className="text-sm  pl-5">{item.offSetNum}</p>
                                        <p className="text-sm pl-5">{item.date}</p>
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
