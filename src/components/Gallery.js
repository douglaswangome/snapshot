import { useEffect, useState } from 'react';
import './Gallery.css';
import api from '../api';

const Gallery = () => {
  const [formData, setFormData] = useState({
    query: "dog",
    orientation: "landscape",
  });

  const updateInput = (event) => {
    const { type, checked, name, value} = event.target;
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      }
    });
  }

  const radiosData = ["landscape", "portrait", "squarish"];
  const radios = radiosData.map(radio => {
    return (
      <div key={radio}>
        <input
          id={radio}
          name="orientation"
          value={radio}
          checked={formData.orientation === radio}
          onChange={updateInput}
          type="radio"
        />
        <label htmlFor="radio">{radio}</label>
      </div>
    );
  });

  const [photos, setPhotos] = useState(null);

  const getPhotos = async(query, orientation) => {
    await api.search
      .getPhotos({query: query, orientation: orientation})
      .then(response => setPhotos(response.response.results))
      .catch(err => console.log(err));
  }

  useEffect(() => {
    getPhotos(formData.query, formData.orientation);
  })

  return (
    <div className="gallery">
      <div className="inputs">
        <input
          name="query"
          value={formData.query}
          placeholder="Search Query"
          onChange={updateInput}
          type="text"
        />
        <div className="radios">
          {radios}
        </div>
        <button onClick={() => getPhotos(formData.query, formData.orientation)}>
          <span>Submit</span>
        </button>
      </div>
      {photos === null ? 
        <div className="loading">
          <div className="lds-dual-ring"></div>
        </div>
        :
        <div className="images">
          {photos.map((photo) => {
            return (
              <div key={photo.id} className="image">
                <img src={photo.urls.regular} alt="" />
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}

export default Gallery;