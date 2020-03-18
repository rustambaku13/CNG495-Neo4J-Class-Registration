import {Form,Input,Button,Modal,Checkbox} from 'antd';
import React, { useState } from 'react';
import {LoginUser} from '../../helpers/userHelpers';
export default function LoginModal({active,session,minimize,updateUser}){
    const [student_id,setStudentId] = useState("")
    const [password,setPassword] = useState("")
    async function  onFinish(){
        const response = await LoginUser(session,student_id,password)        
        if(response){          
          //If response exists
          const tmp = response.toObject();          
          updateUser({...tmp.me,position:tmp.position,dept:tmp.dept})
          minimize()

        }
    }
    function onFinishFailed(){

    }
    return (
        <Modal onCancel={minimize} footer={[]}  visible={active}>
            <Form style={{"width":"100%","paddingTop":"2rem"}}
      
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Student Id"
        name="id"
        rules={[{ required: true, message: 'Please input your id!' }]}
      >
        <Input value={student_id} onChange={e=>{setStudentId(e.target.value)}}/>
      </Form.Item>

      <Form.Item
        label="Password "
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password value={password} onChange={e=>{setPassword(e.target.value)}}/>
      </Form.Item>

      <Form.Item  name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
        </Modal>
    )
}