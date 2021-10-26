import React,{useEffect, useState} from "react";
import {View,Text, StatusBar, TextInput,Button, FlatList} from "react-native";
import { openDatabase } from "react-native-sqlite-storage";

const db = openDatabase({
  name:"rn_sqlite",
})


const App = () =>{
  const [category, setCategory] = useState();
  const [categories,setCategories] = useState([]);

  const createTables = () =>{
    db.transaction(txn => {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20))',
        [],
        (sqlTxn,res) => {
          console.log("table created sucessfully")
        },
        error =>{ 
          console.log("error on creating table" + error.message);
        },
      )
    })
  }

  const addCategory = () => {
    if (!category){
      alert("Enter category");
      return false;
    }
    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO categories (name) VALUES (?)',
        [category],
        (sqlTxn,res) => {
          console.log(`${category} category added successfully`);
          getCategories()
        },
        error => {console.log('error on adding category' + error.message);
      },
      );
    })
    setCategory("")
  };

  const getCategories = () =>{
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM categories ORDER BY id DESC',
        [],
        (sqlTxn,res) => {
          console.log('categories retrieved successfully');
          let len = res.rows.length;
          if(len > 0){
            let results = [];
            for(let i = 0;i < len; i++){
              let item = res.rows.item(i);
              results.push({id: item.id, name:item.name})
            }
            setCategories(results);
          }
        },
        error=>{console.log('error on getting categories' + error.message);
      },
    );
  })
}
 const renderCategory = ({item}) =>{
    return (
      <View style={{
        flexDirection:'row',
        paddingVertical:12,
        paddingHorizontal:10,
        borderBottomWidth:1,
        borderColor:"#ddd",
      }}>
        <Text style={{marginRight:9}}>{item.id}</Text>
        <Text>{item.name}</Text>
      </View>
    )
 }
  /*useeffect se ejecutara cada vez que el componente
  se renderize por primera vez y cuando el componente se
  actualizace, el primer parametro es la funcion que queremos que se ejecute,
  el segundo es para especificarle en que momento se actulizara dependiento del
  el cambio de una variable especifica, si recibe [] significa que useEffect solo
  se ejecutara una vez*/
  useEffect(() =>{
    createTables();
    getCategories();
  },[]);
  return(
    <View>
      <StatusBar backgroundColor="orange"/>
      <TextInput 
        placeholder="Enter category"
        value={category}
        onChangeText={setCategory}
        style={{marginHorizontal:8}}
      />
      <Button title="Submit" onPress={addCategory}/>
      <FlatList 
          data={categories} 
          renderItem={renderCategory}
          key={cat => cat.id}/>
    </View>
  )
}

export default App;
