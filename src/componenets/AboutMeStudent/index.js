import React, { useEffect } from 'react';
import {Descriptions} from 'antd';
export default function AboutMeStudent({me}){
    
    
    return(
        <Descriptions bordered title="Student Info">
            <Descriptions.Item label="Name">{me.properties.first_name}</Descriptions.Item>
            <Descriptions.Item label="Surname">{me.properties.last_name}</Descriptions.Item>
            <Descriptions.Item label="Id">{me.properties.id.toNumber()}</Descriptions.Item>
            <Descriptions.Item label="Nationality">{me.properties.nationality}</Descriptions.Item>
            <Descriptions.Item label="Address">
            {me.properties.address}
            </Descriptions.Item>
            <Descriptions.Item label="CGPA">
            {me.properties.cgpa}
            </Descriptions.Item>
      </Descriptions>
    )
}