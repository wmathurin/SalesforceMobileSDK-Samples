#!/bin/bash

# Run update if you want to refresh dependencies
# We check-in dependencies/ because we don't want to require consumer of the repo to run npm install or grunt

if [ ! -d "tools" ]
then
    echo "You must run this tool from the root directory of your repo clone"
else
    echo "Updating dependencies"
    cd tools
    npm install .
    grunt
    cd ..
    echo "Cleaning up salesforcemobilesdk-shared"
    mkdir tmplibs; mv hybrid/dependencies/salesforcemobilesdk-shared/libs/*.js tmplibs/
    mkdir tmptest; mv hybrid/dependencies/salesforcemobilesdk-shared/test/Mock*.js tmptest/
    rm -rf hybrid/dependencies/*mobilesdk-shared
    rm -rf hybrid/dependencies/salesforcemobilesdk-shared
    mkdir hybrid/dependencies/salesforcemobilesdk-shared
    mv tmplibs hybrid/dependencies/salesforcemobilesdk-shared/libs
    mv tmptest hybrid/dependencies/salesforcemobilesdk-shared/test
    ln -s salesforcemobilesdk-shared/libs hybrid/dependencies/mobilesdk-shared
    echo "Moving up mobile-ui-elements"
    rm -rf hybrid/mobile-ui-elements
    mv hybrid/dependencies/mobile-ui-elements/elements hybrid/mobile-ui-elements
    rm -rf hybrid/dependencies/mobile-ui-elements
fi
