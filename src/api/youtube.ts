import axios from "axios"

export const getYoutubePlaylist = ({ apiKey, playlistId }) => {
  return new Promise(async (resolve, reject) => {
    await axios.get(`${process.env.REACT_APP_YOUTUBE_API_URL}/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`)
      .then((data) => resolve(data?.data?.items))
      .catch((err) => reject(err))
  })
}
