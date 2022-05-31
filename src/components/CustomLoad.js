import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function CustomLoad ({ openLoad }) {    

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={openLoad}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}    
