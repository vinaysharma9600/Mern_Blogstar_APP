import React ,{ useContext }from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import  noteContext  from "../context/notes/notesContext";
import AddNote from './AddNote';
import NoteItem from './NoteItem';
import { useNavigate } from 'react-router-dom';

const Notes =(props)=>{
    const context = useContext(noteContext);
    let navigate = useNavigate();
    const {notes,getAllNotes,editNote} = context;
    const [note,setNote] =useState({id: "",etitle:"",edescription:"",etag:"default"})
    useEffect(()=>{
        if(localStorage.getItem('token')){
            getAllNotes();
        }
        else{
            navigate("/login");
        }
        //eslint-disable-next-line
    },[])
    
    const ref = useRef(0);
    const refClose = useRef(0);
    const updateNote =(currentNote)=>{
        ref.current.click();
        setNote({id:currentNote._id, etitle: currentNote.title ,edescription:currentNote.description,etag:currentNote.tag})
        
    }
    const handleClick = (e)=>{
        
        editNote(note.id,note.etitle,note.edescription,note.etag);
        refClose.current.click();
        props.showAlert("updated successfully",'success');
    }
    const onChange = (e)=>{
        setNote({...note,[e.target.name]:e.target.value})
    }
    return (
        <>
            <AddNote showAlert={props.showAlert}/>
            <button ref = {ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Edit blog</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <div className="container my-3">
                    <form className="my-3">
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                        Title
                        </label>
                        <input
                        type="text"
                        className="form-control"
                        value={note.etitle}
                        id="etitle"
                        name="etitle"
                        aria-describedby="emailHelp"
                        onChange={onChange}
                        />
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="desc" className="form-label">
                        Description
                        </label>
                        <input
                        type="text"
                        className="form-control"
                        value={note.edescription}
                        id="edescription"
                        name="edescription"
                        onChange={onChange}
                        minLength ={5} required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">
                        Tag
                        </label>
                        <input
                        type="text"
                        value={note.etag}
                        className="form-control"
                        id="etag"
                        name="etag"
                        onChange={onChange}
                        />
                    </div>
                    
                    </form>
                </div>
                </div>
                <div className="modal-footer">
                    <button ref = {refClose}type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button onClick={handleClick} type="button" className="btn btn-primary">Update Your blog</button>
                </div>
                </div>
            </div>
            </div>
            <div className=" container row ">
                <h2>Your Articles</h2>
                <div className = "container" >
                     {notes.length === 0 && 'No Article to display ' }
                </div>
                
                {notes.map((note)=>{
                return <NoteItem key ={note._id} updateNote = {updateNote} note = {note} showAlert={props.showAlert}/>
                })}
            </div>
        </>
    )
}
export default Notes;