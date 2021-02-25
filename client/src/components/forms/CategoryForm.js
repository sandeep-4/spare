import React from 'react';


//can alse destructutre {} as in paramater
const CategoryForm=(props)=>(
    <form onSubmit={props.handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => props.setName(e.target.value)}
          value={props.name}
          autoFocus
          required
        />
        <br />
        <button className="btn btn-outline-primary">Save</button>
      </div>
    </form>
)
export default CategoryForm;