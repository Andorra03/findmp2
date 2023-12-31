import React from 'react'
import s from './index.module.scss'
import hackerImg from '../../imgs/security.png'
import { SettingFilled,GoogleSquareFilled,AccountBookFilled,CopyFilled, ProfileFilled, FileFilled, DatabaseFilled } from '@ant-design/icons'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { PagePath } from '@interface'

export const Menu = observer(() => {
    return (
        <div className={s.wrapper}>
            <div className={s.logoWrapper}>
                <img src={hackerImg} className={s.logo}></img>
                <span className={s.name}>FindMP</span>
            </div>
            <Link className={s.item} to={PagePath.WELCOME}>
                <GoogleSquareFilled className={s.space}></GoogleSquareFilled>
                <span>欢迎</span>
            </Link>
            <Link className={s.item} to={PagePath.SYSTEM_PERFORMANCE}>
                <SettingFilled className={s.space}></SettingFilled>
                <span>系统性能</span>
            </Link>
            <Link className={s.item} to={PagePath.DETECT_SINGLE_PACKAGE}>
                <CopyFilled className={s.space}></CopyFilled>
                <span>检测单个包</span>
            </Link>
            <Link className={s.item} to={PagePath.DETECT_DIRECTORY}>
                <ProfileFilled className={s.space}></ProfileFilled>
                <span>检测目录</span>
            </Link>
            <Link className={s.item} to={PagePath.RESULT_DETAIL}>
                <FileFilled className={s.space}></FileFilled>
                <span>检测结果</span>
            </Link>
            <Link className={s.item} to={PagePath.RESULT_LIST}>
                <DatabaseFilled className={s.space}></DatabaseFilled>
                <span>检测结果列表</span>
            </Link>
        </div>
    )
})
//<Link className={s.item} to={PagePath.RESULT_LIST}>
//<MaliciouspacketFilled className={s.space}></MaliciouspacketFilled>
//<span>恶意包列表</span>
//</Link>
