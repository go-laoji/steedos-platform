/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-04-13 10:31:03
 * @LastEditors: yinlianghui@steedos.com
 * @LastEditTime: 2022-05-24 11:03:10
 * @Description: 
 */
var objectql = require('@steedos/objectql');
  
async function insertParentAndChildrenFieldForTreeObject(doc){
    const baseProps = {
        object: doc.name,
        reference_to: doc.name,
        type: 'lookup',
        owner: doc.owner,
        space: doc.space,
        created_by: doc.created_by,
        modified_by: doc.modified_by,
        company_id: doc.company_id,
        company_ids: doc.company_ids
    }
    let docs = [];
    docs.push(
      {
        _name: 'parent',
        label: '父' + doc.label,
        ...baseProps
      }
    )
    docs.push(
      {
        _name: 'children',
        label: '子' + doc.label,
        multiple: true, 
        visible_on: "{{false}}",
        ...baseProps
      }
    )
    _.each(docs, async (item)=>{
        await objectql.getObject('object_fields').insert(item);
    })
}

module.exports = {
    insertParentAndChildrenFieldForTreeObject
}