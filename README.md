# HAIviz: Healthcare Associated Infections Visualization Tool

A web-based application to create an interactive dashboard for visualising and integrating healthcare-associated genomic epidemiological data.

## Using HAIviz online.
Visit https://haiviz.fordelab.com/.

## Run HAIviz locally, for self hosting or for development.
To run HAIviz locally, for self-hosting, or development, please follow these instructions. Basic command line experience is recommended for the installation process. More detailed, step-by-step instructions are also available in the video tutorials on the HAIviz page Documentation.

1. Install Node.js
   - Download the Node.js installer (e.g. the LTS version) from https://nodejs.org/en. 
   - Installing Node.js will also install the `npm` package manager. Check if they have been installed correctly by typing the following commands in your terminal: `npm -v` and `node -v`. These commands should return the versions of `npm` and Node.js installed.

2. Clone or download HAIviz (this) repository.
   - Clone the repository using git by typing: `git clone https://github.com/nalarbp/haiviz.git`. This will create a new directory named `haiviz`.
   - Alternatively, you can download the repository by clicking the 'Code' dropdown button and selecting 'Download ZIP'. After downloading, unzip the repository, which will create a new directory named `haiviz-main`.

3. To run HAIviz offline or for self-hosting.
   - Install the `serve` Node.js package by typing: `npm install serve -g` (or `sudo npm install serve -g` if admin permission is required)
   - Navigate to HAIviz repository by typing: `cd haiviz/` or `cd haiviz-main/`
   - Use the `serve` package to serve the build directory by typing: `serve -s build/`

4. To run the development mode.
   - The development mode requires Node.js version 16.20.2.
   - Install the `n` package (for switching between Node.js versions) by typing: `npm install n -g` (or `sudo npm install n -g`).
   - Use `n` to install and switch to the Node.js v16.20.2 by typing: `n install 16.20.2` (or `sudo n install 16.20.2`).
   - Check if the Node.js version has been changed by typing `node -v`, which should return v16.20.2.
   - Navigate to the HAIviz repository by typing `cd haiviz` or `cd haiviz-main`.
   - Install all the required dependency packages by typing `npm install -s`.
   - Start the development server by typing `npm start`. 
   - Some Warnings may be displayed (e.g: Browserslist: caniuse-lite is outdated. Please run: npx browserslist@latest --update-db), but its safe to ignore and wait until compilation complete.
   - This will open your internet browser with the default local address: [http://localhost:3000](http://localhost:3000).
   - This development server and browser will reflect any changes you make to the source code.

## Setting up preloaded datasets.
You can setup the preloaded datasets to link your input files directly to HAIviz.
- Add your input files into the `haiviz/build/data/preloaded/` directory
- Update the configuration file located at `haiviz/build/data/preloaded_dataset.json`. 
- This feature allows you to create multiple datasets to be included in HAiviz, such as for visualising multiple projects or for continuous update.
- A basic example on how to programatically update this preloaded datasets is available in `haiviz/input_simulation/setup_preloaded_dateaset.R`.

## Have any questions?
Please feel free to send it to my email: b.permana@uq.edu.au

## Cite us
If you use HAIviz please cite HAIviz website: https://haiviz.fordelab.com

## License
GPLv3
