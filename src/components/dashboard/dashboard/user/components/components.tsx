import { Box, BoxProps, TextField, Typography } from "@mui/material";

export const Flex = ({ children, ...props }: BoxProps) => (
    <Box  display={'flex'} gap={'16px'} {...props}>
        {children}
    </Box>
)

export const FormInput = ({ errorMsg, name, value, ...props }: any) => {
    const { name: errorName, message } = errorMsg

    return (
        <Box>
            <TextField
                error={errorName === name}
                fullWidth
                id="outlined-basic"
                variant="outlined"
                value={value}
                name={name}
                helperText=""
                {...props}
            />
            {
                errorName && message && errorName === name && (
                    <Typography
                        fontSize={12}
                        color={'red'}
                        lineHeight={'14px'}
                        px={'8px'}
                        pt={'2px'}
                    >
                        {message}
                    </Typography>
                )
            }
        </Box>
    )
}