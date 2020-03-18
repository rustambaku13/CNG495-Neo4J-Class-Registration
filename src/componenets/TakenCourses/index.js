import React, { useEffect,useState } from 'react';
import {retrievePassedCourses} from '../../helpers/userHelpers';
import {Table} from 'antd';
import Integer from 'neo4j-driver/lib/integer.js'
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
        title: 'Passing Grade',
        dataIndex: "grade",
        key: 'grade',
      },
  ];
export default function TakenCourses({session,me}){
    const [courseList,setCourseList] = useState([])
    useEffect(()=>{
        retrievePassedCourses(session,me.properties.id).then(e=>{
            setCourseList(e)
        })
    },[])
    console.log(courseList)
    return(
        <>
            <Table title={e=>"Courses Taken"} columns={columns} dataSource={courseList}/>
        </>
    )
}