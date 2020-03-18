import React, { useEffect, useState } from 'react';
import {Table,Button,Row, Modal, AutoComplete,Form, message} from 'antd'; 
import {retrieveTakenCourses,autoCompleteCourses,enrollToCourse,dropCourse} from '../../helpers/userHelpers';
const { Option } = AutoComplete;

export default function RegisterCourses({me,session}){
    const [courseList,setCourseList] = useState([])
    const [addCourseModal, setaddCourseModal] = useState(false)
    const [dataSource,setdataSource] = useState([])
    const [selectedCourse,setselectedCourse] = useState(null)
    function deleteRecord(code){
      dropCourse(session,me.properties.id,code).then(e=>{
        setCourseList(courseList.filter(item=>item.properties.code!=code)) 
      },e=>{
        message.error("Error")
      })
    }
    const children = dataSource.map(item=>(
      <Option key={item.properties.code.toNumber()} value={item.properties.code.toNumber()}>
        {item.properties.name} {item.properties.verbose_name}
      </Option>
    ))
    const columns = [
      {
        title: 'Course',
        dataIndex: ["properties","name"],
        key: 'name',
      },
      {
        title: 'Code',
        dataIndex: ["properties","code"],
        key: 'code',
        render: (text,record,index)=>{return text.toNumber()}
      },
      {
        title: 'Name',
        dataIndex: ["properties","verbose_name"],
        key: 'verbose_name',
      },
      {
        title: 'Action',
        key: 'action',
          render: (text, record) => (
            <span>              
              <a onClick={()=>{deleteRecord(record.properties.code)}}>Delete</a>
            </span>
          ),
        }, 
        
    ];
    useEffect(()=>{
        retrieveTakenCourses(session,me.properties.id).then(e=>{
            setCourseList(e)
        })
    },[])
    async function onSearch(e){
        const s = await autoCompleteCourses(session,me.properties.id,e)
        setdataSource(s)
    }
    async function addCourse(selectedCourse){
      enrollToCourse(session,me.properties.id,selectedCourse).then((e)=>{   
        setCourseList([e.course,...courseList])  
      },e=>{
        message.error("Course has already been registered")
      })
    }
    return(
        <>
          <Modal onOk={()=>{addCourse(selectedCourse)}} visible={addCourseModal} onCancel={()=>{setselectedCourse(null);setaddCourseModal(false)}}> 
            <Form>
              <h2 style={{"textAlign":"center"}}>Search Course</h2>
              <Form.Item
              name="id"
              >
                <AutoComplete onSelect={e=>{setselectedCourse(e)}} onSearch={onSearch} placeholder="Enter Course id or Name">
                  {children}
                </AutoComplete>
              </Form.Item>
            </Form>
          </Modal>
            <Table title={()=>(<Row type="flex" justify="space-between"><h3>Current Courses</h3><Button onClick={()=>{setaddCourseModal(true)}} type="ghost">Add Course</Button></Row>)} columns={columns} dataSource={courseList}></Table>
        </>
    )

}