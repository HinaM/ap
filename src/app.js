const supabaseUrl = 'https://rvntujioqkontqqjhxdb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bnR1amlvcWtvbnRxcWpoeGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjkwNTMsImV4cCI6MjA3NTUwNTA1M30.YGPpQFss05qu3YmmHvnmfJycmhbQDTSKlzDz25Gbg6c';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);




    

new Vue({
    el: '#app',
    data: {
        files: [],
        bucket: 'aipri',
        older: 'main', 
        files: [],
        lovefiles: [],
        allph: [],
        allph9: [],
        loading: false,
        error: '',
        charaName: 'HINA',
        myqr: '',
        profile: '',
        season: "甜點季度",
        level: 4,
        call: "鑽石甜點",
        collection: []
    },
    
    async mounted() {
        this.fetchFiles()
        this.mainCo()
        this.mainPro()
        this.love()
        this.allp()
        try {
          
          const { data, error } = await supabaseClient
            .from('apr')
            .select('*')
            .order('id', { ascending: true })
        
          if (error) throw error
        
          this.collection = data || []

          
        
        } catch (err) {
          console.error('Supabase select failed:', err)
        }
        
    },
    methods: {
        async fetchFiles () {
            this.loading = true
            this.error = ''
            this.files = []
  
            const folderPath = this.folder || '' // 根目錄就用空字串
  
            // 1️⃣ 用 supabaseClient，而不是 client
            const { data, error } = await supabaseClient
              .storage
              .from(this.bucket)
              .list(folderPath, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' }
              })
  
            if (error) {
              console.error('讀取失敗：', error)
              this.error = '讀取失敗：' + error.message
              this.loading = false
              return
            }
  
            // 2️⃣ 把每個檔案轉成 publicUrl
            this.files = data.map(file => {
              const path = (folderPath ? folderPath + '/' : '') + file.name
  
              const { data: urlData } = supabaseClient
                .storage
                .from(this.bucket)
                .getPublicUrl(path)
  
              return {
                name: file.name,
                path,
                url: urlData.publicUrl
              }
            })
  
            this.loading = false
        },
        async mainCo(){
            this.loading = true
            this.error = ''
            this.files = []
  
            const folderPath = this.folder || '' // 根目錄就用空字串
  
            // 1️⃣ 用 supabaseClient，而不是 client
            const { data, error } = await supabaseClient
              .storage
              .from(this.bucket)
              .getPublicUrl('main/MyQR.jpg')
  
            if (error) {
              console.error('讀取失敗：', error)
              this.error = '讀取失敗：' + error.message
              this.loading = false
              return
            }
            
            this.myqr = data.publicUrl
            console.log(data.publicUrl)
            
        },
        async mainPro(){
            this.loading = true
            this.error = ''
            this.files = []
  
            const folderPath = this.folder || '' // 根目錄就用空字串
  
            // 1️⃣ 用 supabaseClient，而不是 client
            const { data, error } = await supabaseClient
              .storage
              .from(this.bucket)
              .getPublicUrl('profile/1.jpg')
  
            if (error) {
              console.error('讀取失敗：', error)
              this.error = '讀取失敗：' + error.message
              this.loading = false
              return
            }
            
            this.profile = data.publicUrl
            console.log(data.publicUrl)
            
        },
        async love () {
          this.loading = true
          this.error = ''
          this.lovefiles = []

          const folderPath = 'love'

          // 1️⃣ 用 supabaseClient，而不是 client
          const { data, error } = await supabaseClient
            .storage
            .from(this.bucket)
            .list(folderPath, {
              limit: 3,
              offset: 0,
              sortBy: { column: 'created_at', order: 'desc' }
            })

          if (error) {
            console.error('讀取失敗：', error)
            this.error = '讀取失敗：' + error.message
            this.loading = false
            return
          }

          // 2️⃣ 把每個檔案轉成 publicUrl
          this.lovefiles = data.map(file => {
            const path = (folderPath ? folderPath + '/' : '') + file.name

            const { data: urlData } = supabaseClient
              .storage
              .from(this.bucket)
              .getPublicUrl(path)

            return {
              name: file.name,
              path,
              url: urlData.publicUrl,
              addedOn: file.created_at ? new Date(file.created_at).toLocaleDateString('zh-TW'): '未知'
            }
          })

          this.loading = false
        },
        async allp () {
          this.loading = true
          this.error = ''
          this.allph = []

          const folderPath = 'allPhoto'

          // 1️⃣ 用 supabaseClient，而不是 client
          const { data, error } = await supabaseClient
            .storage
            .from(this.bucket)
            .list(folderPath, {
              offset: 0,
              sortBy: { column: 'created_at', order: 'desc' }
            })

          if (error) {
            console.error('讀取失敗：', error)
            this.error = '讀取失敗：' + error.message
            this.loading = false
            return
          }

          // 2️⃣ 把每個檔案轉成 publicUrl
          this.allph = data.map(file => {
            const path = (folderPath ? folderPath + '/' : '') + file.name

            const { data: urlData } = supabaseClient
              .storage
              .from(this.bucket)
              .getPublicUrl(path)

            return {
              name: file.name,
              path,
              url: urlData.publicUrl,
              addedOn: file.created_at ? new Date(file.created_at).toLocaleDateString('zh-TW'): '未知'
            }
          })
          this.allph9 = this.allph.slice(0, 9);
          this.loading = false
        },
        go(url) {
          window.location.href = url;
        },
        async plus(id,num){

          const newNum = num + 1;
          
          
          const { error: updateError } = await supabaseClient
          .from('apr')
          .update({ num: newNum})
          .eq('id', id);

          if (updateError) {
            alert("更新失敗：" + updateError.message);
            console.error(updateError);
            return;
          }

          const item = this.collection.find(f => f.id === id);
          if (item) {
            item.num = newNum;
          }
          alert("修改成功！");
          
  
          /*
          
          this.updateA_title = this.valueTitle;
          this.updateA_description = this.valueDescription;
          this.updateA_price = this.valuePrice;
          this.updateA_safety_stock = this.valueSafetyStock;
          this.updateA_launch = this.valueLaunch;
          this.updateA_cata = this.valueCata;
          this.updateA_pid = this.valuePId;
  
         
  
          
          const now = new Date().toISOString()
          
          const { error: updateError } = await supabase
          .from('tickets')
          .update({ product_id:this.updateA_pid, title: this.updateA_title ,  description: this.updateA_description , price: this.updateA_price , safety_stock:this.updateA_safety_stock , launch: this.updateA_launch , category: this.updateA_cata, latest_time: now})
          .eq('id', id);
  
          alert("修改成功！");
          window.location.reload();
          */
          
  
        },
        
        
    },
    computed: {
      
    }
    })