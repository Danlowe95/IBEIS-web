# IBEIS-web
Web interface and API for IBEIS.

[![Build Status](https://travis-ci.org/Danlowe95/IBEIS-web.svg?branch=master)](https://travis-ci.org/Danlowe95/IBEIS-web)
[![Dependency Status](https://david-dm.org/Danlowe95/IBEIS-web.svg)](https://david-dm.org/Danlowe95/IBEIS-web)
[![devDependency Status](https://david-dm.org/Danlowe95/IBEIS-web/dev-status.svg)](https://david-dm.org/Danlowe95/IBEIS-web#info=devDependencies)

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


A WORKSPACE is a set of filters. If you filter by Grevy Zebras in Lewa, That WORKSPACE is the collection of images/annotations that fit that criteria

-If you filter by LEWA, and nothing else, your workspace will be the collection of images with at LEAST Lewa in the metadata. The images that show up can be processed fully or completely unprocessed.

-you will be able to have a filtering option called UNPROCESSED.  This will be a set of images that have not had detection run in the parameters of the workspace (Eg. In a Grevy Zebra/Lewa workspace, unprocessed images will be all images in Lewa that have not had Grevy Zebra detection run on them yet.)  This allows the user to easily find all images that MIGHT fit the workspace that haven't had proper detection run on them.
