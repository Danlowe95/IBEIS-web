# IBEIS-web
Web interface and API for IBEIS.



Features to add and To Do:              (second row pulls from top row)
-Add options for grouping and sorting: Occurences /Images      /Group of Animals
                                      -Encounter  /Annotations /Single animal

-MediaAsset should have an UploadID (or at least, a date/time uploaded), so we can upload, set an upload ID, and easily switch the workspace to the entire set of newly updated images (if the user wants to).





Upload workflow:
-Choose image folder
-Prefilter (get rid of images of humans/ the ground/ etc) Manual 
-Break up into occurences (by time taken/location) - process unknown - tunable (parameters)
-Upload process starts and finishes.
-Popup: Would you like to switch your workspace filters to your newly uploaded images? (YES/NO)
-On yes: Workspace filter sets to none except the new UploadID. 
-The user can then one-click run detection and begin their processing on their new images.

Detection/Identification:
-Detection (any set of images, any workspace)
  -Review (one image at a time, produces annotations)
  -Review annotations as well (for orientation, quality, etc)
-Extract encounter (applied to occurence) (this is identification on an occurence. it produces encounters)
  -processing
  -review
  -name encounter  (by encounter)
    -processing 
    -review
