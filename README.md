# HAIviz: Healthcare Associated Infections Visualization Tool

A web-based application to create an interactive dashboard for visualising and integrating healthcare-associated genomic epidemiological data.

## Using HAIviz online.
Visit https://haiviz.fordelab.com/.

## Run HAIviz locally, for self hosting or for development.
To run HAIviz locally, for self-hosting, or development, follow these instructions. Basic command line experience is recommended for the installation process.

1. Install Node.js version 16.20.2 by downloading it from: https://nodejs.org/download/release/v16.20.2/
   - For Windows: The `node-v16.20.2-x64.msi` for 64-bit systems or `node-v16.20.2-x86.msi` for 32-bit systems.
   - For MacOS: The `node-v16.20.2-darwin-arm64.tar.gz` for Apple Silicon-based systems or `node-v16.20.2-darwin-x64.tar.gz` for Intel-based systems.
   - For Linux: Pick the appropriate package based on your Linux distribution.

2. Install `serve` Node.js package.
   - Installing Node.js will also install the `npm` package manager. Check if `npm` is already installed by typing `npm -v` in your terminal. Also, verify your Node.js version by typing `node -v`, which should return `v16.20.2`. 
   - Then install `serve` by typing `npm install serve -g`
   - We will use the `serve` package to serve the builded HAIviz app.
   However, before proceeding, first clone or download the repository.

3. Clone or download this repository.
   - Clone the repository using git: `git clone https://github.com/nalarbp/haiviz.git`. This will create a new directory named `haiviz`. 
   - Alternatively, you can download the repository by clicking the 'Code' dropdown button and selecting 'Download ZIP'. After downloading, unzip the repository, which will create a new directory named `haiviz-main`. 
 
4. To run HAIviz offline or for self-hosting.
   - From step 3.
   - Navigate to the HAIviz repository by typing `cd haiviz/` or `cd haiviz-main/`.
   - Use the `serve` package to serve the build directory. Type `serve -s build`. 

5. To run the development mode.
   - From step 3. 
   - Navigate to the HAIviz repository by typing `cd haiviz` or `cd haiviz-main`.
   - Install all the required dependency packages by typing `npm install -s`.
   - Start the development server by typing `npm start`. 
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
