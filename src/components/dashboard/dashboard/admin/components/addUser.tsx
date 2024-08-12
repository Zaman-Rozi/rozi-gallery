import { Alert, Box, Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, Grid, InputLabel, OutlinedInput } from "@mui/material"
import { useState } from "react"

export const AddUser = ({ onAddUser, loading }) => {
    const [input, setInput] = useState('')
    const [error, setError] = useState(false)

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const onSubmit = () => {
        if (isValidEmail(input)) {
            onAddUser(input)
            setError(false)
        } else {
            setError(true)
        }
    }

    return (
        <Box >
            <Card>
                <CardHeader subheader="Add User" title="Dashboard" />
                <Divider />
                <CardContent>
                    <Grid md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Email </InputLabel>
                            <OutlinedInput onChange={(e) => setInput(e.target.value)} label="Email address" type="email" />
                        </FormControl>
                    </Grid>
                </CardContent>
                {error ? <Alert style={{width:'90%' , margin:"auto"}} color="error">Invalid Email.</Alert> : null}
                <CardActions>
                    <Button disabled={loading} onClick={onSubmit} fullWidth variant="text">
                        Add User
                    </Button>
                </CardActions>
            </Card>
        </Box>
    )
}