"use client";
import {useMemo, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import PaidIcon from "@mui/icons-material/Paid";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import VisuallyHiddenInput from "./components/VisuallyHiddenInput";
import {blueGrey} from "@mui/material/colors";
import ReportCard from "./components/ReportCard";

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

    const revenue = useMemo(
        () =>
            Math.round(
                parcels.reduce((memo, parcel) => {
                    return memo + parcel.revenue;
                }, 0),
            ),
        [parcels],
    );

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
                <Grid item xs={12} sm={12} md={4}>
                    <ReportCard
                        title="Parcel count"
                        value={parcels.length}
                        loading={loading}
                        Icon={LocalShippingIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <ReportCard
                        title="Total revenue"
                        value={revenue}
                        unit="€"
                        loading={loading}
                        Icon={PaidIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <ReportCard
                        title="Avg revenue"
                        value={parcels.length ? Math.round((revenue / parcels.length) * 100) / 100 : "0"}
                        unit="€"
                        loading={loading}
                        Icon={PriceCheckIcon}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
