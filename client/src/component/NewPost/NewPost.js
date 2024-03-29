import React, { useEffect, useState } from 'react'
import { UilScenery } from '@iconscout/react-unicons'
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import './NewPost.css'
import { createPost, getAllpost } from '../../action/PostAction.js';
import { getMe } from '../../action/AuthAction';


const NewPost = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState();
  const { me } = useSelector((state) => state.meUser);

  const [previewImage, setPreviewImage] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch])


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result);
      }
    }
    reader.readAsDataURL(file);

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createPost({ image: image, caption: caption }, navigate));
    let boxBtn = document.getElementsByClassName('shar_btn')[0];
    boxBtn.innerHTML = '<div class="loading_circle"><i class="fas fa-spinner"></i></div>'
    setTimeout(() => {
      boxBtn.innerHTML = `<button className="button ps-button" type='submit' >share</button>`
      boxBtn.removeAttribute("disabled")
    }, 2000);
    boxBtn.setAttribute('disabled', true)
    setCaption("");
    setImage("");
  }

  return (
    <div className="newPostShare">
      <div className="PostShare">
        <img
          src={me?.image.url}
          alt="Profile"
        />
        <div>
          <form onSubmit={handleSubmit}>
            <input type="text" className='write_about' placeholder="write something..." name='caption' onChange={(e) => setCaption(e.target.value)} value={caption} />
            <div className="postOptions">
              <label for='image' className="option" style={{ color: "var(--photo)" }} >
                <UilScenery />
                Photo
              </label>


              <label for='video' className="option" style={{ color: "var(--photo)" }} >
                <UilPlayCircle />
                Video
              </label>
              <div className="option" style={{ color: "var(--shedule)" }}>
                <UilSchedule />
                Shedule
              </div>
              <div style={{ display: "none" }}>
                <input type="file" name='image' id='image' onChange={handleImageChange} />
              </div>
              {/* <div style={{ display: "none" }}>
              <input type="file" name='video' id='video' accept="video/mp4, video/mov" />
            </div> */}
              <div className="shar_btn">
                <button className="button ps-button" type='submit' >share</button>
              </div>
            </div>
          </form>
          {image && (
            <div className="previewImage">
              <UilTimes onClick={() => setImage(null)} />
              <img src={image} style={{ height: '150px' }} alt="preview" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewPost