import {useState} from 'react';
import './NewPlaylist.css';
import Tracklist from '../Tracklist/Tracklist.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false

export default function NewPlaylist({
  onRemove, tracks, setPlaylistTracks, setPlaylistDetails, oldPlaylist, setOldPlaylist, setTrackUris, playlistDetails
}) {
  const [showDetails, setShowDetails] = useState(false);
  const toggleBtn = <button type="button" id="toggleDetails"
    className={'btn btn-outline-light ' + (showDetails ? 'toggleOpen' : 'toggleClosed')}
    aria-label="Toggle details" onClick={() => toggleDetails()}>
      <FontAwesomeIcon icon={showDetails ? faAngleDown : faAngleRight} />
  </button>;
  const expandedNew = <div>
    <div>
      <input type="text" id="descriptionInput" placeholder='Description (optional)' />
    </div>
    <div>
      <input type="checkbox" id="privateCheck" name="Private" value="privatePlaylist" />
      <label for="privatePlaylist">Private</label>
      <input type="checkbox" id="collabCheck" name="Collaborative" value="collabPlaylist"
        onChange={toggleCollab} />
      <label for="privatePlaylist">Collaborative</label>
    </div>
  </div>;

  // useEffect(() => {
  //   if(oldPlaylist){
  //     if(oldPlaylist === 'clear'){
  //       clearPlaylist();
  //     } else {
  //       setDetailElements(oldPlaylist);
  //     }
  //   }
  // }, [oldPlaylist, showDetails]);

  const [prevDetails, setPrevDetails] = useState(showDetails);
  const [prevPlaylist, setPrevPlaylist] = useState(oldPlaylist);
  if (showDetails !== prevDetails || oldPlaylist !== prevPlaylist) {
    setPrevDetails(showDetails);
    setPrevPlaylist(oldPlaylist);
    if(oldPlaylist){
      (oldPlaylist === 'clear') ? clearPlaylist() : setDetailElements(oldPlaylist);
    }
  }


  function toggleDetails() {
    setShowDetails(!showDetails);
  }
  function toggleCollab() {
    const privateCheckbox = document.querySelector("#privateCheck");
    const collabCheckbox = document.querySelector("#collabCheck");
    if(collabCheckbox.checked) {
      privateCheckbox.checked = true;
      privateCheckbox.disabled = true;
    } else {
      privateCheckbox.checked = false;
      privateCheckbox.disabled = false;
    }
  }
  function triggerPlaylist(key) {
    if(key === 'Enter'){
      savePlaylist()
    }
  }
  function setDetailElements(elem) {
    document.getElementById("playlistTitleInput").value = elem.name;
    if(showDetails){
      document.getElementById("descriptionInput").value = elem.description;
      document.querySelector("#privateCheck").checked = !elem.public;
      document.querySelector("#privateCheck").disabled = elem.collaborative;
      document.querySelector("#collabCheck").checked = elem.collaborative;  
    }
  }
  function savePlaylist() {
    const uris = tracks.map((track) => track.uri);
    const name = document.getElementById("playlistTitleInput").value;
    const description = document.getElementById("descriptionInput")?.value || '';
    const privateCheckbox = document.querySelector("#privateCheck")?.checked || false;
    const collabCheckbox = document.querySelector("#collabCheck")?.checked || false;
    const details = {
      name: name,
      description: description,
      public: !privateCheckbox,
      collaborative: collabCheckbox
    }
    if(!name || !uris.length){
      console.error(`Saving a playlist requires both a name, and at least one track.`)
    } else {
      console.log(tracks);
      setPlaylistDetails(details);
      setTrackUris(uris);
      setDetailElements({name: '', description: '', public: true, collaborative: false});
      setPlaylistTracks([]);
    }
  }
  function clearPlaylist() {
    setOldPlaylist(null);
    setDetailElements({name: '', description: '', public: true, collaborative: false});
    setTrackUris([]);
    setPlaylistTracks([]);
  }
  return (
    <section className="playlist col my-3" data-testid="playlist">
      <div className="my-2 text-center">
        <div>{toggleBtn}<input type="text" id="playlistTitleInput" placeholder="New Playlist"
            onKeyDown={e => triggerPlaylist(e.key)} /></div>
        {showDetails && expandedNew}
      </div>
        <Tracklist tracklist={tracks}
        onRemove={onRemove}
        mode='remove' />
        <p className="text-center mt-1">
          <button type="button" className="btn btn-light mr-1"
          onClick={savePlaylist}>Save to Spotify</button>
          <button type="button" className="btn btn-light"
          onClick={clearPlaylist}>Clear</button>
        </p>
    </section>
  );
}