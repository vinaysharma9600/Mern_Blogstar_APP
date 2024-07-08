import NoteContext from "./notesContext";
import { useState } from "react";

const NoteState =(props)=>{
    const host ="http://localhost:5000"
    const notesInitial = [];
    const [notes, setNotes] = useState(notesInitial);

    // Get All Notes
    const getAllNotes = async()=>{
        //TODO : API Calls
        const response = await fetch(`${host}/api/notes/fetchallNotes`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'auth-token' : localStorage.getItem('token')
            },
           
        })
        
        const json = await response.json();
        
        setNotes(json);
    }



    //Add a note
    const addNote = async(title,description,tag)=>{
        //TODO : API Calls
        const response = await fetch(
            `${host}/api/notes/addNotes`, 
            {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'auth-token' : localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag})
        })
        const note = await response.json();
        setNotes(notes.concat(note));
    }

    //Delete a note
    const deleteNote = async(id)=>{
        // API CALLS
        const response = await fetch(`${host}/api/notes/delete/${id}`, {
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                "auth-token" : localStorage.getItem('token')
            }
        })
        const json  = await response.json();
        console.log(json);

        
        const newNotes = notes.filter((note)=>{ return note._id !== id})
        setNotes(newNotes)
    }

    //Edit a Note
    const editNote = async(id,title,description,tag) =>{
        // Api Call
        const response = await fetch(`${host}/api/notes/update/${id}`, {
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                "auth-token" : localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag})
        })
        const json = await response.json();
        console.log(json);
        getAllNotes(); // Also can do this and below 
        // Logic to edit in client
        // let newNotes = JSON.parse(JSON.stringify(notes));
        // for (let index = 0; index < newNotes.length; index++) {
        //     const element = newNotes[index];
        //     if(element._id === id ){
                
        //         newNotes[index] = title;
        //         newNotes[index] = description;
        //         newNotes[index] = tag;
        //         break;
        //     }
            
        // }
        // setNotes(newNotes);
    }
    return (
        <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getAllNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;