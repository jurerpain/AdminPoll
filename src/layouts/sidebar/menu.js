import {Anchor, HardDrive, Headphones, Home} from 'react-feather'

export const MENUITEMS = [
    {
        menutitle:"General",
        menucontent:"Dashboard, logs",
        Items:[
            {path: '/admin', icon: Home, title: 'Admin panel', type: 'link',},
            {path: '/admin/logs', icon: HardDrive, title: 'Logs', type: 'link'}
        ]

    },
]