
export const handleApiCall = (req, res) => {
    // Personal Access Token (PAT) for authentication
    const PAT = '***';
    const USER_ID = 'fmsarp';
    const APP_ID = 'Devtest';
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = req.body.input;

    // Creating a JSON payload for the Clarifai API
    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": IMAGE_URL
            }
          }
        }
      ]
    });

    // Configuring the options for the API request
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT,
        'Content-Type': 'application/json', // Specifying JSON content type
      },
      body: raw
    };
     // Making a fetch request to the Clarifai API
     fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, requestOptions)
     .then(response => response.json())
     .then(result => {
       // Extracting information about detected regions in the image
       const regions = result.outputs[0].data.regions;

       const faceData = regions.map(region => {
         const boundingBox = region.region_info.bounding_box;
         const width = req.body(Number(document.getElementById('inputimage').width));
         const height = req.body(Number(document.getElementById('inputimage').height));

         return {
           topRow: boundingBox.top_row * height,
           leftCol: boundingBox.left_col * width,
           bottomRow: height - boundingBox.bottom_row * height,
           rightCol: width - boundingBox.right_col * width,
         };
       });
       setFaceData({faceData});
     })
     .catch(err => console.log("cannot fetch clarifi API"));
}
    

export const hangleImageEntries = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'))
}
