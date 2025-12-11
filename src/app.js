const supabaseUrl = 'https://rvntujioqkontqqjhxdb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bnR1amlvcWtvbnRxcWpoeGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjkwNTMsImV4cCI6MjA3NTUwNTA1M30.YGPpQFss05qu3YmmHvnmfJycmhbQDTSKlzDz25Gbg6c';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey)


    


new Vue({
    el: '#app',
    data: {
        files: [],
        bucket: 'aipri',
        older: 'main', 
        files: [],
        lovefiles: [],
        loading: false,
        error: '',
        charaName: 'HINA',
        myqr: '',
        profile: ''
    },
    
    async mounted() {
        this.fetchFiles()
        this.mainCo()
        this.mainPro()
        this.love()
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
              
              offset: 0,
              sortBy: { column: 'created_at', order: 'asc' }
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
        go(url) {
          window.location.href = url;
        }
        
        
    },
    computed: {
        
    }
    })