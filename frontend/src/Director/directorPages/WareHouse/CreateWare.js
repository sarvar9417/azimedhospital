import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { CheckWare } from './CheckWare'
import { Loader } from '../../components/Loader'

toast.configure()
export const CreateWare = () => {
  const auth = useContext(AuthContext)
  const { request, error, loading, clearError } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari
  const [modal, setModal] = useState(false)

  //Ware ma'lumotlari
  const [ware, setWare] = useState({
    name: "",
    type: "",
    pieces: 0,
    price: 0
  })

  const changeHandler = (event) => {
    if (event.target.name === "price") {
      setWare({
        ...ware,
        [event.target.name]: parseInt(event.target.value)
      })
    } else {
      setWare({
        ...ware,
        [event.target.name]: event.target.value
      })
    }
  }

  const checkWare = () => {
    if (CheckWare(ware)) {
      return notify(CheckWare(ware))
    }
    window.scrollTo({ top: 0 })
    setModal(true)
  }

  const createHandler = async () => {
    try {
      const data = await request("/api/warehouse/register", "POST", { ...ware }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push('/director/warehouse')
    } catch (e) {
      notify(e)
    }
  }

  const notify = (e) => {
    toast.error(e)
  }

  useEffect(() => {
    if (error) {
      notify(error)
      clearError()
    }
  }, [notify, clearError])

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="datatable table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-center">Mahsulot nomi</th>
                      <th className="text-center">Turi</th>
                      <th className="text-center">Narxi</th>
                      <th className="text-center">Saqlash</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html">
                            <input defaultValue={ware.name} onChange={changeHandler} name="name" className="addDirection" />
                          </span>
                        </span>
                      </td>
                      <td className="text-center"><input defaultValue={ware.type} onChange={changeHandler} name="type" type="string" className="addDirection" /></td>
                      <td className="text-center"><input defaultValue={ware.price} onChange={changeHandler} name="price" type="number" className="addDirection" /></td>
                      <td className="text-center"><button onClick={checkWare} className="btn button-success" >Saqlash</button> </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Modal oynaning ochilishi */}
      <div className={modal ? "modal" : "d-none"}>
        <div className="modal-card">

          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="datatable table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-center">Mahsulot nomi</th>
                      <th className="text-center">Turi</th>
                      <th className="text-center">Narxi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html"> {ware.name} </span>
                        </span>
                      </td>
                      <td className="text-center">{ware.type}</td>
                      <td className="text-center">{ware.price}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer">
              <div className=" text-center">
                <button onClick={createHandler} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
              </div>
            </div>
          </div>



        </div>
      </div>

    </div >
  )
}
