import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from "react-icons/md";
import AddEditNotes from './AddEditNotes';
import moment from "moment";
import Modal from "react-modal"
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNotesImg from "../../assets/add-note-svgr.svg";
import NoData from "../../assets/no-data-svg.svg";

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    iShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    iShown: false,
    message: "",
    type: "add",
  });


  const [allNotes, setAllNotes] = useState([])
  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({iShown: true, data: noteDetails, type: "edit"});
  };


  const showToastMessage = (message, type) =>{
    setShowToastMsg({
     iShown:true,
     message,
     type,
   });
 };

  const handleCloseToast = () =>{
     setShowToastMsg({
      iShown:false,
      message: "",
    });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occured. please try again")
    }
  }

  const deleteNote = async (data) => {
    const noteId = data._id

    try{
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if(response.data && !response.data.error){
          showToastMessage("Note Deleted Successfully", "delete")
          getAllNotes()
      }
  }catch(error){
      if(
          error.response &&
          error.response.data &&
          error.response.data.message
      ){
        console.log("An unexpected error occured. please try again")
      }
  }
  }

  //search for a note
  const onSearchNote = async (query) => {
    try{
      const response = await axiosInstance.get("/search-notes", {
        params : {query},
      });
      if(response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    }catch(error){
      console.log(error);
    }
  };

  //pinning
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
        try{
            const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
              isPinned: !noteData.isPinned,
            });

            if(response.data && response.data.note){
                showToastMessage("Note Pinned Successfully");
                getAllNotes();
            }
        }catch(error){
            console.log(error);
        }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes()
    getUserInfo();
    return () => { };
  }, []);

  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        onSearchNote={onSearchNote} 
        handleClearSearch={handleClearSearch}
      />

      <div className='container mx-auto'>
        {allNotes.length > 0 ?(
        <div className='grid grid-cols-3 gap-4 mt-8'>
          {allNotes.map((item, index) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={moment(item.createdOn).format('Do MMM YYYY')}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => deleteNote(item)}
              onPinNote={() => updateIsPinned(item)}
            />
          ))}
        </div>
        ):(
          <EmptyCard imgSrc={isSearch ? NoData : AddNotesImg} 
          message= { isSearch ? `Oops! No matching Notes found !!!` : `start creating your first note! click the 'Add' button`}/>
        )}
      </div>

      <button className='w-16 h-16 flex items-center justify-center 
      rounded-2xl bg-primary hover:bg-blue-600 
      absolute right-10 bottom-10' onClick={() => {
          setOpenAddEditModal({ iShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.iShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 
        overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ iShown: false, type: "add", data: null });
          }}
          getAllNotes = {getAllNotes}
          showToastMessage={showToastMessage} 
        />
      </Modal>

      <Toast
        iShown={showToastMsg.iShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home
