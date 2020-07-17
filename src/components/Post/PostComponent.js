import React from 'react';
import { Container } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import axios from 'axios';
import './PostComponent.css';




let rows = [];

let urlApi = "http://localhost:3700"



class PostComponent extends React.Component {


    nameRef = React.createRef();
    descriptionRef = React.createRef();


    state = {
        rowFilter: [],
        loading: true,
        open: true,
    };

    getPost() {
        axios.get(`${urlApi}/post`).then(res => {
            rows = res.data.message;
            this.setState({
                rowFilter: rows,
                loading: false
            });
        });
    }
  
constructor(props){
    super(props);
    this.getPost();
}


    remove = (index, name) => {
        rows.splice(index, 1);
        this.setState({
            rowFilter: rows
        });
        console.log("nombre a eliminar")
        axios.delete(`${urlApi}/post`, {data:{ name: name }})
            .then(function (response) {
                console.log(response.data);
    })
     
}


searchPostByName = (event) => {

    if (!event.target.value) {
        this.setState({
            rowFilter: rows
        })
    } else {
        this.setState({
            rowFilter: rows.filter((row) =>
                row.name.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .includes(event.target.value.toLowerCase())
            )
        })
    }
}

submitPost = (e) => {
    e.preventDefault();

    var newPost = { name: this.nameRef.current.value, description: this.descriptionRef.current.value };
    axios.post(`${urlApi}/post`, newPost)
        .then(function (response) {
            console.log("respuesta", response.data);
            rows.push(response.data);
            console.log("rows",rows);
            this.setState({
                rowFilter: rows
            });
            return (
                <h2>Creado</h2>
            )
        })
        .catch(function (error) {
            console.log(error);
        });


};

render() {

    if (!this.state.loading) {
        return (

            <div>
                <Container>
                    <label className="search-input">Buscar por nombre</label>
                    <input className="search-input" type="text" name="searchName" onKeyUp={this.searchPostByName} />
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell >Nombre</TableCell>
                                    <TableCell align="center">Descripción</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {this.state.rowFilter.map((row, index) =>
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="center">{row.description}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => this.remove(index, row.name)} startIcon={<DeleteIcon />}>
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                )

                                }
                            </TableBody>
                        </Table>
                    </TableContainer>


                    <form className="form" onSubmit={this.submitPost}>
                        <div className="form-group">
                            <TextField required name="name" label="Nombre" inputRef={this.nameRef} />
                        </div>
                        <div className="form-group">
                            <TextField required inputRef={this.descriptionRef}
                                name="description"
                                label="Descripción"
                                multiline

                            />

                        </div>

                        <Button color="primary" size="small" type="submit" startIcon={<SaveIcon />}>
                            Guardar
                </Button>
                    </form>
                </Container>
            </div>

        );
    } else { return (<h2>Cargando...</h2>) }


}
}

export default PostComponent;