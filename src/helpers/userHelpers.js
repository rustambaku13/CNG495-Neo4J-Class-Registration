import { int } from "neo4j-driver/lib/integer"

export async function LoginUser(session,id,password){    
    
    try{
        const {records} = await session.run('MATCH (me:Person) WHERE (me.id=$id AND me.password = $password) OPTIONAL MATCH (me)-[job:WORKS_IN]->(e:Department) RETURN me,job.position as position,e.name as dept',{        
            id:parseInt(id),
            password:password
        })
        return records[0]    
    }catch(e){
        throw e
    }
    
}

export async function retrievePassedCourses(session,id){

   try{
        const {records} = await session.run("MATCH (me:Student)-[e:TOOK]->(course:Course) WHERE (me.id = $id AND e.passed = TRUE) RETURN course,e.grade AS grade",{
            id:parseInt(id)
        })                
        const a = records.map(item=>item.toObject())        
        return a
   }catch(e){
       throw e
   }



}

export async function retrieveTakenCourses(session,id){
    try{
        const {records} = await session.run("MATCH (me:Student)-[e:TOOK]->(course:Course) WHERE (me.id = $id AND NOT EXISTS(e.passed)) RETURN course",{
            id:parseInt(id)
        })                
        const a = records.map(item=>item.toObject().course)        
        return a
   }catch(e){
       throw e
   }

}

export async function retrieveCourses(session,id){
    // Retrieve all courses except those takes this semester
    try{
        const {records} = await session.run("MATCH (me:Student)-[e:TOOK]->(course:Course) WHERE (me.id = $id AND e.passed = FALSE) RETURN course",{
            id:parseInt(id)
        })                
        const a = records.map(item=>item.toObject().course)        
        return a
   }catch(e){
       throw e
   }
}

export async function autoCompleteCourses(session,id,text){
    try{
        const {records} = await session.run("MATCH (course:Course)-[:OFFERED_BY]->()<-[:STUDIES_IN]-(s:Student) WHERE (s.id = $id AND (course.name CONTAINS $param)) RETURN DISTINCT course",
        {
            id:parseInt(id),
            param:text
        })
        
        const a = records.map(item=>item.toObject().course)     
        console.log(a)
        return a   
    }catch(e){
        throw e
    }
}

export async function getAllCourses(session,dept){
    try{
        const {records} = await session.run("MATCH (course:Course)-[:OFFERED_BY]->(d:Department) OPTIONAL MATCH (course)-[:PREREQUIRES]->(prereq:Course) WHERE (d.name = $dept) RETURN course,collect(prereq) as prereq",
        {
            dept:dept
        })        
        
    const a = records.map(item=>item.toObject())    
    console.log(a) 
        return a   
    }catch(e){
        throw e
    }
}

export async function deleteCourse(session,code){
    try{
        const {records} = await session.run("MATCH (course:Course) WHERE (course.code = $code) DETACH DELETE course",
        {
            code:code.toNumber()
        })                    
        return true 
    }catch(e){
        throw e
    }
}

export async function enrollToCourse(session,id,course_code){
    const txc = session.beginTransaction()
    try{
        const match_result = await txc.run("OPTIONAL MATCH (course:Course)<-[r:TOOK]-(me:Student) WHERE (course.code = $code AND me.id = $id) RETURN r AS result ",{
            code:course_code,
            id:id
        })
        console.log(match_result.records[0].get("result"))
        if(match_result.records[0].get("result")){
            // Exists Already
            console.log("L")
            await txc.commit()
            throw new Error
        }                
        console.log("L2")
        const {records} = await txc.run("MATCH (course:Course) WHERE (course.code = $code) MATCH (me:Student) WHERE (me.id = $id) MERGE (me)-[:TOOK]->(course) RETURN course",{
            code:course_code,
            id:id
        })                
        await txc.commit()
        if(records.length){
            return records[0].toObject()
        }
        return null

    }catch(e){
        throw e
    }

}

export async function dropCourse(session,id,code){
    try{
        const {records} = await session.run("MATCH (p:Student)-[r:TOOK]->(c:Course) WHERE (p.id = $id AND c.code=$code AND NOT EXISTS (r.passed)) DELETE r",{
            code:code,
            id:id
        })        
        return records

    }catch(e){
        throw e
    }
}

export async function createCourse(session,dept,id,name,code,preqs=[]){

    const txc = session.beginTransaction()
    try {
        let answer = await txc.run("MATCH (d:Department) WHERE (d.name = $dept) CREATE (course:Course {code:$id,name:$code,verbose_name:$name})-[:OFFERED_BY]->(d) RETURN course",{
            id:int(id),
            dept:dept,
            name:name,
            code:code
        })        
        if(preqs.length){
            console.log(preqs)
            answer = await txc.run(
                'MATCH (course:Course) WHERE course.code = $id MATCH (e:Course) WHERE (e.code IN $list) CREATE (course)-[:PREREQUIRES]->(e) RETURN course,collect(e) as prereq',
                {
                    id: id,
                    list:preqs.map(item=>int(parseInt(item)))
                }
            )
        }
    const {records} = answer;  
    const ret = records[0].toObject();
    await txc.commit()
    return ret
    } catch (error) {    
    await txc.rollback()
    console.log('rolled back')
     throw error
    }
}