export function handleApiCall(res, req) {
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
       .then(res => res.json())
       .then(responseData => {
        const data = responseData;
        res.json(data)
       })
       .catch(err => res.status(400).json('unable to work with API'))
}
export function hangleImageEntries(req, res, db) {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'))
}