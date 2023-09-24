"use client";
import {useState} from "react";
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PaidIcon from "@mui/icons-material/Paid";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import {blueGrey} from "@mui/material/colors";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

export default function Home() {
    const [fileToUpload, setFileToUpload] = useState(null);
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(false);

    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setFileToUpload(file);
        }
    };

    const uploadToServer = async () => {
        const body = new FormData();
        body.append("file", fileToUpload);
        setLoading(true);
        try {
            const response = await fetch("/api/parcel", {
                method: "POST",
                body,
            });
            setLoading(false);
            setParcels(await response.json());
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    return (
        <Box
            sx={{
                padding: 6,
                backgroundColor: blueGrey[200],
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                height: "100vh",
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Stack spacing={2} direction="row">
                        <Button component="label" variant="contained" startIcon={<InsertDriveFileIcon />}>
                            Choose file
                            <VisuallyHiddenInput type="file" onChange={uploadToClient} />
                        </Button>
                        <Button
                            component="label"
                            disabled={!fileToUpload}
                            variant="contained"
                            onClick={uploadToServer}
                            startIcon={<CloudUploadIcon />}
                            sx={{
                                color: loading ? "primary.main" : "primary.contrastText",
                            }}
                        >
                            Upload
                            {loading && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: "primary.contrastText",
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        marginTop: "-12px",
                                        marginLeft: "-12px",
                                    }}
                                />
                            )}
                        </Button>
                    </Stack>
                    <Typography mt={2} color={blueGrey[900]}>
                        {fileToUpload?.name ?? "No file selected"}
                    </Typography>
                </Grid>
                <Grid item sm={12} md={4}>
                    <Card sx={{position: "relative"}}>
                        <Grid container sx={{opacity: loading ? 0.3 : 1}}>
                            <Grid item xs={4} className="flex items-center justify-center">
                                <LocalShippingIcon fontSize="large" sx={{color: blueGrey[900]}} />
                            </Grid>
                            <Grid item xs={8}>
                                <CardContent>
                                    <Typography variant="h5" component="div" sx={{color: blueGrey[900]}}>
                                        Parcel count
                                    </Typography>
                                    <Typography sx={{color: blueGrey[900]}}>{parcels.length}</Typography>
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
                </Grid>
                <Grid item sm={12} md={4}>
                    <Card sx={{position: "relative"}}>
                        <Grid container sx={{opacity: loading ? 0.3 : 1}}>
                            <Grid item sm={12} md={4} className="flex items-center justify-center">
                                <PaidIcon fontSize="large" sx={{color: blueGrey[900]}} />
                            </Grid>
                            <Grid item sm={12} md={8}>
                                <CardContent>
                                    <Typography sx={{color: blueGrey[900]}} variant="h5" component="div">
                                        Revenue
                                    </Typography>
                                    <Typography sx={{color: blueGrey[900]}}>
                                        {Math.round(
                                            parcels.reduce((memo, parcel) => {
                                                return memo + parcel.revenue;
                                            }, 0),
                                        )}{" "}
                                        €
                                    </Typography>
                                </CardContent>
                            </Grid>
                        </Grid>
                        {loading && (
                            <CircularProgress
                                size={32}
                                sx={{
                                    color: "primary.main",
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    marginTop: "-12px",
                                    marginLeft: "-12px",
                                }}
                            />
                        )}
                    </Card>
                </Grid>
                <Grid item sm={12} md={4}></Grid>
            </Grid>
        </Box>
    );
}
