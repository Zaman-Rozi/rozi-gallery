import { useUser } from "@/hooks/use-user"
import { craeteURLfromGallaryID, makeDocID } from "@/lib/helpers"
import { selectArchivedGallaries } from "@/store/selectors/data"
import { Box, Typography } from "@mui/material"
import { ArchiveBox } from "@phosphor-icons/react"
import { useSelector } from "react-redux"

export const PinedGallaries = () => {
    const pinedGallaries = useSelector(selectArchivedGallaries)
    const { user } = useUser()
    const onSelect = (item) => {
        const URL = craeteURLfromGallaryID({ gallaryId: makeDocID(item?.key, item?.password), userId: user?.uid , folderName:item?.folder })
        window.open(URL, '_blank')
    }

    if (pinedGallaries && pinedGallaries?.length === 0) {
        return null
    }
    return (
        <Box component="nav" sx={{ height: "100%", px: '12px', display: "flex", flexDirection: 'column', overflow: 'hidden' }}>
            <Box
                sx={{
                    alignItems: 'center',
                    borderRadius: 1,
                    color: 'var(--NavItem-color)',
                    display: 'flex',
                    gap: 1,
                    p: '6px 16px',
                    position: 'relative',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                }}
            >
                <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
                    <ArchiveBox color='var(--mui-palette-primary-main)' size={'20px'} />
                </Box>
                <Box sx={{ flex: '1 1 auto' }}>
                    <Typography
                        component="span"
                        sx={{ color: 'var(--mui-palette-primary-main)', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
                    >
                        Pined Gallaries
                    </Typography>
                </Box>
            </Box>
            <Box component="nav" sx={{ ml: "auto", width: "90%", height: "100%", flex: '1', px: '12px', overflowY: 'scroll' }}>
                {
                    pinedGallaries?.map((item, i) => (
                        <Box
                            onClick={() => onSelect(item)}
                            key={i}
                            sx={{
                                alignItems: 'center',
                                borderRadius: 1,
                                color: 'var(--NavItem-color)',
                                cursor: 'pointer',
                                display: 'flex',
                                flex: '0 0 auto',
                                gap: 1,
                                p: '6px 16px',
                                position: 'relative',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                ':hover': {
                                    bgcolor: 'var(--NavItem-active-background)',
                                    color: 'var(--NavItem-active-color)'
                                }
                            }}
                        >
                            <Typography
                                component="span"
                                sx={{
                                    color: 'inherit',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    lineHeight: '28px',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    maxWidth: '150px',
                                    whiteSpace: 'nowrap',
                                    display: 'inline-block',
                                }}
                            >
                                {item?.firstName}
                            </Typography>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    )
}