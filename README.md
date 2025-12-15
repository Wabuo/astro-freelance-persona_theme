# astro-persona-theme

## Install workflow
To use this theme please checkout this git reposetorry.
Then in the sam place without going in to the just cched out folder,
run the following comands to create your websites project folder as a siblings folder to the themes folder

1. `yarn create astro --template minimal --no-git --install name_for_my-web-page-folder` &emsp; Creates an empty Astro project
2. `cd name_of_your-web-page-folder` &emsp; Change directorry in to your new project
3. `yarn add ../astro-persona-theme` &emsp; Adds the theme as a node dependancy
4. `yarn astro-persona-theme init` &emsp; Runns the init script provided by the theme, populates your project with dumy files. 
    * This script will coppy dumy files from the theme in to your project. (let it overwrite everything)<br>
     It can also be used to reset your projet to the themes defaults, this might mean you lose some progress!<br>
     Be carefull what you let it override if your project isnt empty! You might lose some of your work!<br>
     Make smart choices!
5. `git init --initial-branch=main ` &emsp; Initiates your project as a new git reposetorry, feel fre to use any other VCS


Have fun and be carefull out there Astronaut

This Theme and aynthing attouched to it comes with absolutly no warranty, I've got no ide what I'm doing!