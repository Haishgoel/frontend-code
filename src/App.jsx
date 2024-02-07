import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormControl, InputLabel, Select, MenuItem, Button, Grid, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function App() {
  const [description, setDescription] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [image, setImage] = useState("");
  const [showImage, setShowImage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [showTextField, setShowTextField] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [submittedValues, setSubmittedValues] = useState([]);

  function validateStep() {
    if (!image) {
      alert('Please upload image');
    } else if (!restaurantName.trim()) {
      alert('Please enter restaurant name');
    } else if (!description.trim()) {
      alert('Please enter description');
    } else if (selectedRestaurants.length === 0) {
      alert('Please select at least one restaurant type');
    } else {
      AddRestaurant();
    }
  }

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleChange = (event) => {
    setSelectedRestaurants(event.target.value);
  };

  const handleAddButtonClick = () => {
    setShowTextField(true);
  };

  const handleTextFieldChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleTextFieldSubmit = (e) => {
    e.preventDefault();
    setSubmittedValues(prevValues => [...prevValues, inputValue]);
    setInputValue("");
    setShowTextField(false);
  };

  const handleDelete = (index) => {
    setSubmittedValues(prevValues => prevValues.filter((_, i) => i !== index));
  };

  function params() {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('restaurantName', restaurantName);
    formData.append('description', description);
    formData.append('selectedRestaurants', selectedRestaurants.join(','));
    return formData;
  }

  function AddRestaurant() {
    axios.post('use-api-url', params())
      .then(response => {
        if (response.data.statusCode === 200) {
          alert("Successfully added the restaurant");
        } else {
          alert('Invalid data');
        }
      })
      .catch(error => {
        console.error('Error adding restaurant:', error);
        alert('Failed to add restaurant. Please try again later.');
      });
  }

  const onProfileImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setShowImage(URL.createObjectURL(file));
  }

  return (
    <div>
      <div className="adminedit">
        <h3>Add Restaurant</h3>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="upload-image">Upload Image</InputLabel>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="upload-image"
                  type="file"
                  onChange={onProfileImageUpload}
                />
                <label htmlFor="upload-image">
                  <Button variant="outlined" component="span">
                    Upload
                  </Button>
                </label>
                <img src={showImage || image} alt="" className="img-circle profile_image" />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="restaurant-name"
                label="Restaurant Name"
                variant="outlined"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                label="Description"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="user-select-label">Select Restaurant Type</InputLabel>
                <Select
                  labelId="user-select-label"
                  id="user-select"
                  multiple
                  value={selectedRestaurants}
                  onChange={handleChange}
                  inputProps={{
                    name: 'selectedRestaurants',
                    id: 'selectedRestaurants',
                  }}
                >
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={validateStep}>Save</Button>
            </Grid>
          </Grid>
        </form>
        <Button onClick={handleAddButtonClick}>Add Text</Button>
        {showTextField && (
          <form onSubmit={handleTextFieldSubmit}>
            <TextField
              fullWidth
              value={inputValue}
              onChange={handleTextFieldChange}
              placeholder="Enter value"
            />
            <Button type="submit">Save Text</Button>
          </form>
        )}
        <div>
          <h4>Submitted Values:</h4>
          {submittedValues.map((value, index) => (
            <div key={index}>
              {value}
              <IconButton aria-label="delete" onClick={() => handleDelete(index)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
