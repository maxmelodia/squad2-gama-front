import { useState, useEffect, useContext, useRef } from 'react';

import { Card, Grid, Avatar, Typography, CardContent, Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, 
TextField, MenuItem, Select, Stack, Divider} from '@mui/material';
import { fDate2, fDateTime2 } from '../../../utils/formatTime';    
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomLoad from '../../../components/CustomLoad';
import UserContext from '../../../contexts/user-context';
import api from '../../../services/api';

export default function DialogPlanejamento({handleClose, open, planejamento}) {
    const { dataUser } = useContext(UserContext);
    const data_plan = planejamento.data_plan;
    const [isLoad, setIsLoad] = useState(false);

    const [plan, setPlan] = useState({
        id: null,
        conexao_id: null,
        data_plan: null,
        cidade: '',
        descricao: '',
        situacao: '',
      });
      
      const RegisterSchema = Yup.object().shape({
        cidade: Yup.string().min(2, 'Muito curto!').required('Preencha a cidade que estão planejando viajar'),
        // email: Yup.string().email('Email deve ser válido').required('Email obrigatório'),
        // password: Yup.string().required('Senha obrigatório'),
      });  
      
      const formik = useFormik({
        initialValues: plan,
        validationSchema: RegisterSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            formik.setSubmitting(false);
            await updatePlanejamento(values);
            handleClose();
        },
      });        

      useEffect(() => {
        formik.setValues({
          id: planejamento.id,
          conexao_id: planejamento.conexao_id,
          data_plan: planejamento.data_plan,
          cidade: planejamento.cidade,
          descricao: planejamento.descricao || '',
          situacao: planejamento.situacao,
        });    
      },[]);      

    const updatePlanejamento = async (values) => {
        const data = {
            id: values.id,
            cidade: values.cidade,
            descricao: values.descricao,
            situacao: values.situacao
        }
        setIsLoad(true);
        await api(dataUser.token)
        .put(`planejamento`, data)
        .then((response) => {
            setIsLoad(false);
        })
        .catch((error) => {
          console.log(error.message); 
          setIsLoad(false);
        });
    }; 
 
    return (
          <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 800 } }}
            maxWidth="md"
            open={open}
          >
            <CustomLoad openLoad={isLoad} />  
            <DialogTitle>Planejar Viagem
            <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                Início: {fDate2(data_plan)}
              </Typography> 
            </DialogTitle>

            <form noValidate onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <Grid container spacing={2}>  
                            
                        <Grid item sm={12} md={9} lg={9}>
                            <TextField
                                fullWidth
                                label="Cidade Destino"
                                name="cidade"
                                value={formik.values.cidade ? formik.values.cidade : '' } 
                                onChange={formik.handleChange}
                                error={formik.touched.cidade && Boolean(formik.errors.cidade)}
                                helperText={formik.touched.cidade && formik.errors.cidade}                            
                            />
                        </Grid> 
        
                        <Grid item sm={12} md={3} lg={3}>
                            <Select
                                fullWidth
                                label="Status"
                                name="situacao"
                                value={formik.values.situacao}
                                onChange={formik.handleChange}
                            >
                                <MenuItem value={'Em Andamento'}>Em Andamento</MenuItem> 
                                <MenuItem value={'Finalizado'}>Finalizado</MenuItem>
                            </Select>
                        </Grid> 

                        <Grid item sm={12} md={12} lg={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={5}
                            label="Informações da viagem"
                            name="descricao"
                            onChange={formik.handleChange}
                            value={formik.values.descricao ? formik.values.descricao : '' } 
                            error={Boolean(formik.touched.descricao && formik.errors.descricao)}
                            helperText={formik.touched.descricao && formik.errors.descricao}
                            />
                        </Grid> 
                            
                    </Grid>
                </DialogContent>
                <DialogActions disableSpacing>
                    <Button type="submit" >Gravar</Button>
                    <Button  onClick={handleClose}>Cancelar</Button> 
                </DialogActions>
            </form>        

          </Dialog>
    );
}