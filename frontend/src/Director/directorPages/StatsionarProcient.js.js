import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { Loader } from '../components/Loader'
import { useHttp } from '../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSort, faPrint } from '@fortawesome/free-solid-svg-icons'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import Select from 'react-select'
import ReactHTMLTableToExcel from 'react-html-to-excel'
import "react-datepicker/dist/react-datepicker.css"
import { AuthContext } from '../context/AuthContext'
const mongoose = require('mongoose')

toast.configure()
export const StatsionarProcient = () => {
    //Avtorizatsiyani olish
    let doctorprocient = 0
    let medsestraprocient = 0
    const auth = useContext(AuthContext)
    const [modal, setModal] = useState(false)
    const [client, setClient] = useState(0)
    const [options, setOptions] = useState()

    let paid = 0
    let unpaid = 0
    let k = 0
    let kk = 0
    const [type, setType] = useState("all")
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
    const [endDate, setEndDate] = useState(new Date(new Date().setHours(23, 59, 59, 0)).toISOString())
    const [born, setBorn] = useState('')
    const { loading, request, error, clearError } = useHttp()
    const [clientId, setClientId] = useState('')
    const [all, setAll] = useState()
    const [datas, setDatas] = useState()

    const getConnectors = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/statsionarprocient/${startDate}/${endDate}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
            let opt = [{ value: 'all', label: 'Barcha' }]
            fetch.datas.map(data => {
                data.connector && opt.push({
                    value: data.connector.doctor,
                    label: data.connector.doctor,
                })
            })
            const ids = opt.map(o => o.value)
            const filtered = opt.filter(({ value }, index) => !ids.includes(value, index + 1))
            setOptions(filtered)
            setDatas(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setAll, startDate, endDate, setOptions])

    const filterDoctor = (e) => {
        if (e.value === "all") {
            setDatas(all)
        } else {
            let filter = all.datas.filter((data) => {
                return data.connector.doctor === e.value
            })
            let a = { datas: "" }
            a.datas = filter
            setDatas(a)
        }
    }

    const getId = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/statsionar/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, clientId, setAll])

    const getBorn = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/statsionarborn/${born}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, born, setAll])


    const notify = (e) => {
        toast.error(e);
    };

    const searchDate = () => {
        getConnectors()
    }

    const sortOnOff = (event) => {
        setType(event.value)
    }

    const searchId = () => {
        getId()
    }

    const searchBornDate = () => {
        getBorn()
    }

    const history = useHistory()
    const [connectorId, setConnectorId] = useState(0)
    const endStatsionar = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/endstatsionar/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            // history.pushState(`/reseption/endstatsionar/${connectorId}`)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, connectorId])

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!all) {
            getConnectors()
            setAll(1)
        }
    }, [notify, clearError])

    if (loading) {
        return <Loader />
    }

    return (
        <div className="container m-5 mx-auto" style={{ minWidth: "1250px" }}  >
            <div className="row mb-3">
                <div className=" col-2">
                    <input
                        onChange={(e) =>  setStartDate( new Date(new Date(e.target.value).setHours(0, 0, 0, 0)).toISOString())}
                        defaultValue={new Date(startDate).toISOString().slice(0, 10)}
                        type='date'
                        name='startDate'
                        loading={loading}
                        className='border rounded p-1 focus:outline-green-800'
                    />
                </div>
                <div className="col-2">
                    <input
                        onChange={(e)=>setEndDate(
                            new Date(
                                new Date(e.target.value).setHours(23, 59, 59, 0)
                            ).toISOString()
                        )}
                        defaultValue={new Date(endDate).toISOString().slice(0, 10)}
                        type='date'
                        name='endDate'
                        className='border rounded p-1 focus:outline-green-800 ml-2'
                        loading={loading}
                    />
                </div>
                <div className="col-1">
                    <button onClick={searchDate} className="btn text-white mb-2" style={{ backgroundColor: "#45D3D3" }}> <FontAwesomeIcon icon={faSearch} /> </button>
                </div>
                <div className="col-2">
                    <input style={{ marginRight: "5px", width: "115px" }} defaultValue={clientId} onChange={(event) => { setClientId(parseInt(event.target.value)) }} className="form-control pb-2 d-inline-block" type="number" placeholder="ID qidiruvi" />
                    <button onClick={searchId} className="btn text-white" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="col-2">
                    <input className="form-control mb-2" type="date" onChange={(event) => { setBorn(new Date(event.target.value)) }} />
                </div>
                <div className="col-1">
                    <button onClick={searchBornDate} className="btn text-white mb-2" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="col-2">
                    <Select onChange={(event) => filterDoctor(event)} defaultValue={options && options[0]} options={options} />
                </div>
            </div>
            <div className="row">
                <div className="offset-11 col-1 text-end">
                    <ReactHTMLTableToExcel
                        className="btn text-white mb-2 btn-success"
                        table="reseptionReport"
                        filename={new Date().toLocaleDateString()}
                        sheet="Sheet"
                        buttonText="Excel"
                    />
                </div>

            </div>
            <div>
                <div style={{ minWidth: "1100px" }} >
                    <table id="" className="table-striped table-hover w-100" style={{ borderBottom: "1px solid #aaa", marginBottom: "10px" }} >
                        <thead>
                            <tr>
                                <th className="no" scope="no" >№ <FontAwesomeIcon icon={faSort} /> </th>
                                <th scope="" className="date text-center" >Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="date text-center" >Ketgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="fish text-center" >F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="phone text-center"> Shifokor <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">Shifokor ulushi <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">Medsestra ulushi <FontAwesomeIcon icon={faSort} /></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>

            <div className="d-none" >
                <table id="reseptionReport" className=" table-hover"  >
                    <thead>
                        <tr>
                            <th className="no" scope="no" >№ <FontAwesomeIcon icon={faSort} /> </th>
                            <th scope="" className="date text-center" >Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="date text-center" >Ketgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="fish text-center" >F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="phone text-center"> Shifokor <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="id text-center">Shifokor ulushi <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="id text-center">Medsestra ulushi <FontAwesomeIcon icon={faSort} /></th>
                        </tr>
                    </thead>
                    <tbody className="" >
                        {
                            datas && datas.datas && datas.datas.map((data, index) => {
                                let date1 = data.usedroom && new Date(data.usedroom.beginDay)|| 0
                                let date2 = data.usedroom && new Date(data.usedroom.endDay) || 0
                                let diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24)) + 1
                                let medsestra = 30000 * diffDays
                                let doctor = 40000 * diffDays
                                doctorprocient = doctorprocient + doctor
                                medsestraprocient = medsestraprocient + medsestra
                                return (
                                    <tr>
                                        <td className="no" scope="no" >{index + 1}</td>
                                        <td scope="" className="date text-center" >
                                            {data.usedroom && new Date(data.usedroom.beginDay).toLocaleDateString()}
                                        </td>
                                        <td scope="" className="date text-center" >
                                            {data.usedroom && new Date(data.usedroom.endDay).toLocaleDateString()}
                                        </td>
                                        <td scope="" className="fish text-center" >
                                            {data.client && data.client.lastname + " " + data.client.firstname}
                                        </td>
                                        <td scope="" className="id text-center">
                                            {data.client && data.client.id}
                                        </td>
                                        <td scope="" className="phone text-center">
                                            {data.connector && data.connector.doctor}
                                        </td>
                                        <td scope="" className="id text-center"> {doctor} </td>
                                        <td scope="" className="id text-center"> {medsestra} </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                    <tfoot>
                        <tr>
                            <td className='fw-bold text-center' colSpan={4}> Shikorlar ulushi </td>
                            <td className='fw-bold text-center' colSpan={4}> Medsestra ulushi </td>
                        </tr>
                        <tr>
                            <td className='fw-bold text-success text-center' colSpan={4}> {doctorprocient} </td>
                            <td className='fw-bold text-success text-center' colSpan={4}> {medsestraprocient} </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="overflow-auto" style={{ height: "65vh", minWidth: "1100px" }}>
                <table className=" table-hover w-100"  >
                    <tbody className="" >
                        {
                            datas && datas.datas && datas.datas.map((data, index) => {
                                let date1 = data.usedroom && new Date(data.usedroom.beginDay) || 0
                                let date2 = data.usedroom && new Date(data.usedroom.endDay) || 0
                                let diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24)) + 1
                                let medsestra = 30000 * diffDays
                                let doctor = 40000 * diffDays
                                return (
                                    <tr>
                                        <td className="no" scope="no" >{index + 1}</td>
                                        <td scope="" className="date text-center" >
                                            {data.usedroom && new Date(data.usedroom.beginDay).toLocaleDateString()}
                                        </td>
                                        <td scope="" className="date text-center" >
                                            {data.usedroom && new Date(data.usedroom.endDay).toLocaleDateString()}
                                        </td>
                                        <td scope="" className="fish text-center" >
                                            {data.client && data.client.lastname + " " + data.client.firstname}
                                        </td>
                                        <td scope="" className="id text-center">
                                            {data.client && data.client.id}
                                        </td>
                                        <td scope="" className="phone text-center">
                                            {data.connector && data.connector.doctor}
                                        </td>
                                        <td scope="" className="id text-center"> {doctor}</td>
                                        <td scope="" className="id text-center"> {medsestra} </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className='fw-bold text-center' colSpan={4}> Shikorlar ulushi </td>
                            <td className='fw-bold text-center' colSpan={4}> Medsestra ulushi </td>
                        </tr>
                        <tr>
                            <td className='fw-bold text-success text-center' colSpan={4}> {doctorprocient} </td>
                            <td className='fw-bold text-success text-center' colSpan={4}> {medsestraprocient} </td>
                        </tr>
                    </tfoot>
                </table>
            </div>



            {/* Modal oynaning ochilishi */}
            {/* <div className={modal ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card p-4" style={{ fontFamily: "times" }}>
                        <div className="text-center fs-4 fw-bold text-secondary">
                            <span className="text-dark">Mijoz: </span>  {client && client.lastname} {client && client.firstname} {client && client.fathername} ga ko'rsatilgan xizmatlar yakunlanganini tasdiqlaysizmi?
                        </div>
                        <div className="row m-1">
                            <div className="col-12 text-center">
                                <button onClick={endStatsionar} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div> */}
        </div>
    )
}
