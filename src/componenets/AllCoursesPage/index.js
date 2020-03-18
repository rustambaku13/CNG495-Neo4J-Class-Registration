import React, { useEffect, useState } from 'react';
import {Table,Button,Row, Modal,Form, Typography, Descriptions, InputNumber, Input, Select, message} from 'antd'; 
import {getAllCourses,deleteCourse,createCourse} from '../../helpers/userHelpers';
const { Option } = Select;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
export default function AllCoursesPage({me,session}){
    const [id,setId]= useState(null);
    const [name,setName] = useState("");
    const [code,setCode] = useState("");
    const [preqs,setPreqs] = useState([]);
    const [courseList,setCourseList] = useState([])
    const [addCourseModal, setaddCourseModal] = useState(false)
    const [updateCourseModal,setupdateModal] = useState({course:{properties:{}}})   
    const courses = courseList.map((value,index,arr)=>{return(<Option value={value.course.properties.code.toNumber()} key={value.course.properties.code.toNumber()}>{value.course.properties.name}</Option>)}) 
    function createRecord(id,code,name,preqs){
        createCourse(session,me.dept,id,name,code,preqs).then((e)=>{            
            setCourseList([e,...courseList])
        },(e)=>{
            message.error("Course with such Id already exists")
        })
    }
    function deleteRecord(code){
        deleteCourse(session,code).then(()=>{
            setCourseList(courseList.filter((value,index,array)=>value.course.properties.code!=code))
        })
    }
    const columns = [
        {
          title: 'Course',
          dataIndex: ["course","properties","name"],
          key: 'name',
        },
        {
          title: 'Code',
          dataIndex: ["course","properties","code"],
          key: 'code',
          render: (text,record,index)=>{return text.toNumber()}
        },
        {
          title: 'Name',
          dataIndex: ["course","properties","verbose_name"],
          key: 'verbose_name',
        }, 
        {
          title: 'Action',
          key: 'action',
            render: (text, record) => (
              <span>
                <a onClick={()=>{setupdateModal({...record,active:true})}} style={{ marginRight: 16 }}>Edit</a>
                <a onClick={()=>{deleteRecord(record.course.properties.code)}}>Delete</a>
              </span>
            ),
          }, 
      ];
    useEffect(()=>{
        getAllCourses(session,me.dept).then(e=>{
            setCourseList(e)
        })
    },[])
 
    return(
        <>
          {updateCourseModal.active?<Modal visible={true} onCancel={()=>{setupdateModal({course:{properties:{}}})}}>
              <Typography style={{"marginTop":"1rem"}}>
                 <Descriptions bordered>
                     <Descriptions.Item span={4} label="Course Name">
                        <Typography.Text editable>{updateCourseModal.course.properties.verbose_name}</Typography.Text>
                     </Descriptions.Item>
                     <Descriptions.Item span={4} label="Course Code">
                        <Typography.Text editable>{updateCourseModal.course.properties.name}</Typography.Text>
                     </Descriptions.Item>
                     <Descriptions.Item span={4} label="Course Id">
                        <Typography.Text editable>{updateCourseModal.course.properties.code.toNumber()}</Typography.Text>
                     </Descriptions.Item>
                     <Descriptions.Item span={4} label="Prerequisites">
                        <ul>
                            {updateCourseModal.prereq.map(item=>(<li>{item.properties.name}</li>))}
                        </ul>
                     </Descriptions.Item>
                 </Descriptions>
              </Typography>
          </Modal>:null}
          <Modal onOk={()=>{createRecord(id,code,name,preqs)}} visible={addCourseModal} onCancel={()=>{setaddCourseModal(false)}}> 
            
              <h2 style={{"textAlign":"center"}}>Add New Course</h2>  
              <Form {...layout}>
                <Form.Item label="Course ID">
                    <InputNumber  value={id} onChange={(e)=>{setId(e)}} style={{"width":"100%"}}/>
                </Form.Item>    
                <Form.Item label="Course Code">
                    <Input value={code} onChange={(e)=>{setCode(e.target.value)}}/>
                </Form.Item>  
                <Form.Item label="Course Name">
                    <Input value={name} onChange={(e)=>{setName(e.target.value)}}/>
                </Form.Item>
                <Form.Item label="Prerequisites">
                    <Select value={preqs} mode="multiple"
                        style={{ width: '100%' }}
                        onSelect={(e)=>{setPreqs([...preqs,e])}}
                        onDeselect={(e)=>{setPreqs(preqs.filter((value)=>value!=e))}}
                        placeholder="Please select"   
                       >
                       {courses} 
                    </Select>
                </Form.Item>  
              </Form>           
            
          </Modal>
            <Table title={()=>(<Row type="flex" justify="space-between"><h3>Current Courses</h3><Button onClick={()=>{setaddCourseModal(true)}} type="ghost">Add Course</Button></Row>)} columns={columns} dataSource={courseList}></Table>
        </>
    )

}