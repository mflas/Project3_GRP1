# PetPals Example

"This is a very basic example of a flask application for adding pets to a map of the US"

- Create a new conda environment for this app with the following code:

- All of our project dependencies will be installed in this environment.

- Note: This should contain only python 3.7—and not anaconda.
```bash
conda create -n pet_pals_env python=3.7
```
- Activate this new environment before proceeding.
```bash
conda activate pet_pals_env

# Note: If you run into issues, try the following command instead.
source activate pet_pals_env
```

- Install the libraries into your new environment. You will need additional libraries for postgres, mongodb, etc when you create your own project.
```bash
# install pip packages listed in requirements file 
pip install -r requirements.txt
```
- Next, to make the run.sh file executable, run the following command:
```bash
chmod a+x run.sh
```
You can test the application by running the following in your command line.
```bash
./run.sh
```
- Navigate to 127.0.0.1:5000 to view your webpage and test out the app locally.

- This starter code uses a .sqlite file as the database, but you can also use postgres.

- To see all the data in the database, navigate to the API, http://127.0.0.1:5000/api/pals.

- There's more work involved in getting the app live in the internet but for this project local server is fine...
    - Note that you can't host flask applications in `GitHub Pages` because it's limited to simple static web pages.