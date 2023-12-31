import { observer } from 'mobx-react'
import React, { useState } from 'react'
import useStore from '@hooks/useStore'
import s from './index.module.scss'
import { Button, Progress, Select } from 'antd'
import { SelectDirectory } from '@component/SelectDirectory'
import { API_KEY, PagePath, type BridgeWindow } from '@interface'
import useMessageApi from '@hooks/useMessageApi'
import Portal from '@component/Portal'
import { PAGE_PARENT_ID } from '@constant'
import Mask from '@component/Mask'
import { useLockFn } from '@hooks/useLockFn'
import { Classifier } from '@store/index'
import { useNavigate } from 'react-router-dom'
import { backgroundColorNames } from 'chalk'

export const DetectDirectory = observer(() => {
    const { setClassifier, setDirPath, dirPath, setResultList, totalPackageNumber, detectPackageNumber } = useStore()
    const messageApi = useMessageApi()
    const [isAnalyzed, setIsAnalyzed] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const navigate = useNavigate()

    const selectClassifier = (classifier: string) => {
        setClassifier(classifier as Classifier)
    }

    const startAnalyze = useLockFn(async () => {
        if (!dirPath) {
            messageApi.error('请选择目录')
            return
        }

        if (isAnalyzing) {
            messageApi.error('请等待分析结束后重试')
            return
        }

        setIsAnalyzing(true)
        const result = await ((window as unknown as BridgeWindow)[API_KEY.ANALYZE_DIRECTORY](dirPath))
        setIsAnalyzing(false)
        setResultList(result)
        setIsAnalyzed(true)
    })

    return (
        <div className={s.wrapper}>
            <div className={s.classifier}>
                <span className={s.classifierLabel}>分类器</span>
                <Select
                    style={{ width: '3.0rem' , fontSize: '2.5rem'}}
                    defaultValue={Classifier.SVM}
                    onChange={selectClassifier}
                    options={[
                        { value: Classifier.SVM, label: 'Kernel SVM' },
                        { value: Classifier.NB, label: 'Naive Bayes' },
                        { value: Classifier.RF, label: 'Random Forest' },
                        //{ value: Classifier.MLP, label: 'Multi Layer Perceptron' }
                    ]}>
                </Select>
            </div>
            <SelectDirectory onSelectFile={packagePath => { setDirPath(packagePath) }} uploadText={'点击上传目录'}></SelectDirectory>
            <Button className={s.button} type='primary' onClick={startAnalyze} >开始分析</Button>
            { isAnalyzed && <Button type="link"  onClick={() => navigate(PagePath.RESULT_LIST) }>查看分析结果</Button>}
            <Portal parentContainer={document.getElementById(PAGE_PARENT_ID)} isShowPortal={isAnalyzing}>
                <Mask>
                    { totalPackageNumber && <Progress percent={ Math.floor(detectPackageNumber / totalPackageNumber * 100) } type={'circle'} trailColor="white" format={percent => <div style={{ fontSize: '0.4rem', color: 'white', fontWeight: '900' }}>{percent}%</div>}></Progress>}
                </Mask>
            </Portal>
        </div>
    )
})
//style={{ marginBottom: '0.4rem'}}