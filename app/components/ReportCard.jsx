import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import {blueGrey} from "@mui/material/colors";

export default function ReportCard({title, value, unit, loading, Icon}) {
    return (
        <Card sx={{position: "relative"}}>
            <Grid container sx={{opacity: loading ? 0.3 : 1}}>
                <Grid item xs={4} className="flex items-center justify-center">
                    <Icon fontSize="large" sx={{color: blueGrey[900]}} />
                </Grid>
                <Grid item xs={8}>
                    <CardContent>
                        <Typography variant="h5" component="div" sx={{color: blueGrey[900]}}>
                            {title}
                        </Typography>
                        <Typography sx={{color: blueGrey[900]}}>
                            {value}
                            {unit ? ` ${unit}` : ""}
                        </Typography>
                    </CardContent>
                </Grid>
            </Grid>
            {loading && (
                <CircularProgress
                    size={32}
                    sx={{
                        color: blueGrey[900],
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                    }}
                />
            )}
        </Card>
    );
}
