document.getElementById('uploadButton').addEventListener('click', async () => {
    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0];
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const imageData = await response.json();
            const imageUrl = `/uploads/${imageData.filename}`; // Assuming the server sends back the filename
            
            // Create HTML elements for the uploaded photo
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            
            const topDiv = document.createElement('div');
            topDiv.classList.add('top');
            
            const userDetailsDiv = document.createElement('div');
            userDetailsDiv.classList.add('userDetails');
            
            const profilepicDiv = document.createElement('div');
            profilepicDiv.classList.add('profilepic');
            
            const profile_imgDiv = document.createElement('div');
            profile_imgDiv.classList.add('profile_img');
            
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('image');
            
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'Uploaded Image';
            
            imageDiv.appendChild(imgElement);
            profile_imgDiv.appendChild(imageDiv);
            profilepicDiv.appendChild(profile_imgDiv);
            userDetailsDiv.appendChild(profilepicDiv);
            
            const h3Element = document.createElement('h3');
            h3Element.textContent = 'Your Name'; // Set the user's name dynamically
            const spanElement = document.createElement('span');
            spanElement.textContent = 'Your Location'; // Set the user's location dynamically
            
            h3Element.appendChild(document.createElement('br'));
            h3Element.appendChild(spanElement);
            
            userDetailsDiv.appendChild(h3Element);
            
            topDiv.appendChild(userDetailsDiv);
            
            const dotDiv = document.createElement('div');
            dotDiv.innerHTML = '<span class="dot"><i class="fas fa-ellipsis-h"></i></span>';
            
            topDiv.appendChild(dotDiv);
            
            cardDiv.appendChild(topDiv);
            
            const imgBxDiv = document.createElement('div');
            imgBxDiv.classList.add('imgBx');
            
            const imgElement2 = document.createElement('img');
            imgElement2.src = imageUrl;
            imgElement2.alt = 'Uploaded Image';
            imgElement2.classList.add('cover');
            
            imgBxDiv.appendChild(imgElement2);
            
            cardDiv.appendChild(imgBxDiv);
            
            const bottomDiv = document.createElement('div');
            bottomDiv.classList.add('bottom');
            
            // Add action buttons, likes, comments, etc. here as per your requirement
            
            cardDiv.appendChild(bottomDiv);
            
            // Append the card to the main container
            const mainContainer = document.getElementById('mainContainer');
            mainContainer.appendChild(cardDiv);
            
            console.log('Image uploaded successfully');
            // Optionally, perform any action after successful upload
        } else {
            console.error('Failed to upload image');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }
});
