import React from 'react'
import { AddServices } from './AddServices'

export const CreateServiceClient = () => {
    return (
        <div className="container" >
            <div className="row" >
                <div className=" col-lg-6 offset-lg-3 mt-5">
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">
                            Yangi xizmatlar qo'shish
                        </button>
                    </div>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                            <AddServices />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
